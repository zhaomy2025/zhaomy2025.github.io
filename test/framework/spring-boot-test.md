# Spring Boot 测试框架

Spring Boot 提供了强大的测试支持，帮助开发者编写高效、可靠的单元测试和集成测试。下面详细介绍 Spring Boot 单元测试中涉及的主要注解、类和接口。

## 一、核心测试注解

| 维度          | 说明                           | 注解                                                                 |
|--------------| ------------------------------ | --------------------------------------------------------------------|
| 测试切片       | 仅加载特定层（如 Web、Data）的上下文，提升速度与专注度 | `@WebMvcTest`、 `@DataJpaTest`、 `@JdbcTest`、 `@JsonTest`、 `@RestClientTest` |
| 上下文控制     | 定制 Spring 应用上下文的加载范围与行为 | `@AutoConfigureTestDatabase`、 `@SpringBootTest`、 `@TestConfiguration` |
| 外部资源       | 管理测试所需的外部依赖（如数据库、消息队列） | `@Testcontainers`、 `@Container`、 `@DynamicPropertySource`         |
| 配置管理       | 覆盖或注入测试专用配置 | `@TestPropertySource`、 `@ActiveProfiles`                             |
| 生命周期与事务 | 控制测试执行流程与数据库事务行为 | `@BeforeEach`/`@AfterEach`、 `@Commit`/`@Rollback`                   |
| HTTP 测试工具  | 模拟或真实调用 HTTP 接口 | `MockMvc`（模拟，用于 @WebMvcTest）、 `RestClient`（真实，用于 @SpringBootTest） |

> `@Testcontainers`、`@Container` 不是 Spring 注解，而是 `org.testcontainers.junit.jupiter.Container`
> 优先使用 `MockMvc` 而非 `RestClient`，除非需要真实调用 HTTP 接口。
> 优先使用切片测试（如`@WebMvcTest`），仅在必要时使用 `@SpringBootTest`。


### 1. 类注解
Spring Boot 测试中的类级别注解主要用于控制测试上下文的加载范围，按功能可分为完整上下文加载型（如 @SpringBootTest）、测试切片型（如 @WebMvcTest、@DataJpaTest 等）以及配置增强型（如 @TestConfiguration、@TestPropertySource）。其中，测试切片注解通过仅加载特定层所需组件，在保证测试准确性的同时显著提升执行效率。下表对比了各常用切片注解自动配置的核心组件：

| 注解            | 自动配置的主要组件                                           |
|-----------------|------------------------------------------------------------|
| @WebMvcTest     | Controller、Converter、Filter、WebMvcConfigurer            |
| @DataJpaTest    | Repository、EntityManager、DataSource、TransactionManager  |
| @JdbcTest       | DataSource、JdbcTemplate、PlatformTransactionManager         |
| @JsonTest       | Jackson/Gson 相关组件、JsonComponent                         |
| @RestClientTest | RestTemplate、RestClient、MockRestServiceServer              |

#### @SpringBootTest
- 功能：加载完整的 Spring Boot 应用上下文，适合集成测试
- 特点：
    - 默认不启动Tomcat/Jetty 等真实服务器，但会加载完整的 Web 相关 Bean
    - 若想完全禁用 Web 支持，应显式设置 webEnvironment = NONE
- 参数：`webEnvironment` - 可选值包括 MOCK(默认)、RANDOM_PORT、DEFINED_PORT、NONE

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK) // 默认值
class MockWebTest {
    // 使用模拟的 Servlet 环境，不启动真实服务器
    // 但会加载 WebMVC 相关配置，可以使用 MockMvc
}

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class NoWebTest {
    // 完全不加载 Web 环境，适合纯业务逻辑测试
}

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RealServerTest {
    // 启动真实服务器在随机端口，适合端到端测试
    @LocalServerPort
    private int port; // 可以获取实际端口号
}
```

#### @TestConfiguration
```java
@TestConfiguration
static class TestConfig {
    @Bean
    public UserService testUserService() {
        return new TestUserService();
    }
}
```

#### @WebMvcTest

- 功能：仅加载 Controller 层的 Spring 上下文，适合控制器单元测试
- 特点：
    - 不会启动真正的 HTTP 服务器，通过 MockMvc 模拟 HTTP 请求
    - 天然隔离业务逻辑，聚焦 Controller 行为验证。
- 使用场景：测试控制器的路由、参数绑定、响应状态等
- 自动配置的组件：
    - @Controller, @RestController, @ControllerAdvice
    - WebMvcConfigurer, Converter, Formatter
    - JsonComponent（用于 JSON 序列化）
    - Filter, HandlerInterceptor（部分）
    - 自动注入 MockMvc
- 不加载的组件：
    - @Service, @Component, @Repository（除非用 @MockBean 显式模拟）
    - 数据源、JPA、事务管理器
    - 完整的 Spring Security 配置（需额外启用）

```java
@WebMvcTest(UserController.class) // ✅ 明确指定被测 Controller
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc; // 自动配置

    @MockBean // ✅ 模拟 Controller 依赖的 Service
    private UserService userService;

    @Test
    void shouldReturnUserById() throws Exception {
        // 1. 准备 Mock 行为
        User mockUser = new User(1L, "张三", "zhangsan@example.com");
        when(userService.findById(1L)).thenReturn(mockUser);

        // 2. 发送模拟请求
        mockMvc.perform(get("/api/users/1"))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.name").value("张三"));

        // 3. 验证 Service 调用
        verify(userService).findById(1L);
    }

    @Test
    void shouldReturn404WhenUserNotFound() throws Exception {
        // 模拟抛出异常
        when(userService.findById(999L))
            .thenThrow(new UserNotFoundException("User not found"));

        mockMvc.perform(get("/api/users/999"))
               .andExpect(status().isNotFound())
               .andExpect(jsonPath("$.message").value("User not found"));
    }
}
```

#### @DataJpaTest
- 功能：专门用于测试 JPA 数据访问层
- 特点：自动配置内存数据库，事务自动回滚
- 使用场景：测试 Repository 接口和数据库操作


#### @JdbcTest
- 功能：
    - 专门用于测试 JDBC 相关组件的测试切片注解。
- 特点
    - 仅自动配置数据源、JDBC Template 等 JDBC 相关组件
    - 默认使用嵌入式数据库（H2）
    - 自动配置 JdbcTestUtils
    - 事务自动回滚
```java
@JdbcTest
class JdbcTemplateTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    @Test
    void testDatabaseConnection() {
        assertThat(dataSource).isNotNull();
        assertThat(jdbcTemplate).isNotNull();
    }

    @Test
    void testJdbcOperations() {
        // 插入测试数据
        jdbcTemplate.update("INSERT INTO users (name, email) VALUES (?, ?)", 
                           "John", "john@example.com");

        // 查询验证
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM users WHERE name = ?", 
            Integer.class, "John"
        );
        
        assertThat(count).isEqualTo(1);

        // 使用 JdbcTestUtils
        int rowCount = JdbcTestUtils.countRowsInTable(jdbcTemplate, "users");
        assertThat(rowCount).isEqualTo(1);
    }

    @Test
    @Sql("/test-data.sql")  // 执行 SQL 脚本初始化数据
    void testWithSqlScript() {
        List<Map<String, Object>> users = jdbcTemplate.queryForList(
            "SELECT * FROM users"
        );
        assertThat(users).hasSize(3);  // 假设 test-data.sql 插入了3条记录
    }
}

// 测试特定数据源配置
@JdbcTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ExternalDatabaseTest {
    // 使用外部配置的数据库而非嵌入式数据库
}
```

#### @JsonTest
- 功能：测试 JSON 序列化和反序列化
- 特点：
    - 仅自动配置与 JSON 相关的组件（Jackson/Gson）
    - 不加载完整的应用上下文，启动快速
    - 还会自动配置 ObjectMapper、JacksonTester，并扫描 @JsonComponent、JsonSerializer、JsonDeserializer 等自定义组件。
- 使用场景：测试 Controller 层返回的 JSON 数据是否符合预期
```java
@JsonTest
class JsonSerializationTest {

    @Autowired
    private JacksonTester<User> json;  // 自动配置 Jackson 测试器

    @Test
    void testSerialize() throws Exception {
        User user = new User("John", "john@example.com", 30);
        
        // 验证序列化
        assertThat(json.write(user))
            .isEqualToJson("expected-user.json");
        
        assertThat(json.write(user))
            .hasJsonPathStringValue("@.name")
            .extractingJsonPathStringValue("@.name")
            .isEqualTo("John");
    }

    @Test
    void testDeserialize() throws Exception {
        String content = "{\"name\":\"John\",\"email\":\"john@example.com\",\"age\":30}";
        
        // 验证反序列化
        assertThat(json.parse(content))
            .isEqualTo(new User("John", "john@example.com", 30));
            
        assertThat(json.parseObject(content).getName())
            .isEqualTo("John");
    }
}

// 支持 Gson 测试
@JsonTest
@GsonTest
class GsonSerializationTest {
    
    @Autowired
    private GsonTester<User> gsonTester;
    
    @Test
    void testGsonSerialization() throws Exception {
        User user = new User("Alice", "alice@example.com", 25);
        assertThat(gsonTester.write(user)).isEqualToJson("alice.json");
    }
}
```

#### @RestClientTest

- 功能：适用于测试使用 RestTemplate、RestClient 或 WebClient 的 客户端组件（如 Service 中封装的 HTTP 调用），而非 Controller。它会自动配置 MockRestServiceServer 来拦截请求。
- 特点
    - 仅自动配置 REST 相关组件（RestTemplate, RestClient, WebClient）
    - 模拟服务器响应，不进行真实网络调用
    - 支持 MockRestServiceServer 自动配置

```java
@RestClientTest(UserService.class)  // 指定要测试的 REST 客户端
class RestClientTestExample {

    @Autowired
    private UserService userService;  // 被测试的 REST 客户端

    @Autowired
    private MockRestServiceServer server;  // 自动配置的模拟服务器

    @Test
    void testGetUser() {
        // 模拟服务器响应
        server.expect(requestTo("/api/users/1"))
              .andRespond(withSuccess(
                  "{\"id\":1,\"name\":\"John\"}", 
                  MediaType.APPLICATION_JSON
              ));

        // 执行测试
        User user = userService.getUser(1L);
        // 验证结果
        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getName()).isEqualTo("John");
        // 验证请求是否按预期发送
        server.verify();
    }

    @Test
    void testPostUser() {
        server.expect(requestTo("/api/users"))
              .andExpect(method(HttpMethod.POST))
              .andExpect(content().contentType(MediaType.APPLICATION_JSON))
              .andExpect(content().json("{\"name\":\"Alice\"}"))
              .andRespond(withCreatedEntity(URI.create("/api/users/2")));

        Long userId = userService.createUser(new User("Alice"));
        assertThat(userId).isEqualTo(2L);
        server.verify();
    }
}

// 测试 WebClient
@RestClientTest(WebClientService.class)
class WebClientTestExample {
    @Autowired
    private WebClientService webClientService;

    @Autowired
    private MockWebServiceServer server;

    @Test
    void testWebClient() {
        server.expect(requestTo("/api/data"))
              .andRespond(withSuccess("response", MediaType.APPLICATION_JSON));
        String result = webClientService.fetchData();
        assertThat(result).isEqualTo("response");
    }
}
```

#### @Testcontainers
```
@Testcontainers
@SpringBootTest
class IntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13");
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
    }
}
```

#### @ExtendWith
- 功能：JUnit 5 中替代 `@RunWith` 的注解，用于扩展测试功能
- 常用扩展：`@ExtendWith(SpringExtension.class)` 用于集成 Spring 测试框架
- 用法：可单独使用或与其他测试注解组合使用

#### @AutoConfigureTestDatabase (可作用于类或方法)
> 注意：@AutoConfigureTestDatabase 虽常用于类上，但本质是配置修饰器，可作用于类或方法。
- 功能：
    - 控制测试中数据库的自动配置行为。
- 主要参数
    - replace：替换策略
        - Replace.NONE：不替换，使用配置的数据源
        - Replace.ANY：总是替换为嵌入式数据库（默认）
        - Replace.AUTO_CONFIGURED：仅替换自动配置的数据源
```java
// 使用嵌入式数据库（默认行为）
@JdbcTest
class EmbeddedDatabaseTest {
    // 自动使用 H2 嵌入式数据库
}

// 使用配置的数据库（不替换）
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ProductionDatabaseTest {
    // 使用 application.properties 中配置的数据源
}

// 与 Testcontainers 结合使用
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:tc:postgresql:13:///testdb"
})
class TestcontainersDatabaseTest {
    // 使用 Testcontainers 提供的 PostgreSQL
}

// 条件化数据库替换
@JdbcTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.AUTO_CONFIGURED)
class ConditionalDatabaseTest {
    // 仅替换自动配置的数据源，不替换手动配置的数据源
}
```

### 2. 方法注解

#### @Test
- 功能：标记方法为测试方法，JUnit 测试运行器会执行被此注解标记的方法
- 位置：方法级别，只能用于无参数、无返回值的公共方法
- JUnit 5 中的 @Test 不再支持 expected 和 timeout 参数

```java
@Test
void testUserService() {
    // 测试逻辑
    assertEquals("expected", actual);
}
```

#### @Sql
- 功能：在测试执行前后执行 SQL 脚本
- 用途：初始化测试数据或清理测试环境
- 参数：`scripts` - SQL 脚本路径，`executionPhase` - 执行阶段（BEFORE_TEST_METHOD/AFTER_TEST_METHOD）

```java
@Test
@Sql(scripts = "/test-data.sql")
void testWithTestData() {
    // 使用初始化的数据进行测试
}
```

#### @BeforeEach
- 功能：在每个测试方法执行前执行
- 用途：设置测试环境、初始化测试数据
- 位置：方法级别，方法必须是公共的、无参数、无返回值

#### @AfterEach
- 功能：在每个测试方法执行后执行
- 用途：清理测试资源、还原测试环境
- 位置：方法级别，方法必须是公共的、无参数、无返回值

#### @BeforeAll(静态方法注解)
- 功能：在所有测试方法执行前执行一次
- 用途：初始化共享资源
- 位置：静态方法级别，方法必须是公共的、无参数、无返回值

#### @AfterAll(静态方法注解)
- 功能：在所有测试方法执行后执行一次
- 用途：释放共享资源
- 位置：静态方法级别，方法必须是公共的、无参数、无返回值

#### @Commit
- 功能：提交测试事务，而不是默认的回滚
- 用途：当需要在测试后保留数据库更改时使用

#### @Rollback
- 功能：控制测试方法执行后的事务回滚行为
- 参数：boolean 值，默认为 true（回滚）

#### @DynamicPropertySource(静态方法注解)
- 功能：覆盖配置
- @TestPropertySource 与 @DynamicPropertySource 优先级
    - 两者都用于覆盖配置，但 @DynamicPropertySource 优先级更高（运行时动态注册）

```java
@DynamicPropertySource
static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("app.database.url", () -> "jdbc:h2:mem:test");
}
```

#### @TestPropertySource
- 功能：
    - 为测试类提供特定的属性配置。
- 特点
    - 覆盖 application.properties 中的配置
    - 支持 properties 文件和内联 properties
    - 测试执行期间有效
```java
// 使用内联属性
@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "server.port=8081",
    "logging.level.org.springframework=DEBUG",
    "app.feature.enabled=true"
})
class InlinePropertiesTest {
    // 使用覆盖后的属性配置
}

// 使用属性文件
@SpringBootTest
@TestPropertySource(locations = "classpath:test-config.properties")
class PropertiesFileTest {
    // 使用 test-config.properties 中的配置
}

// 组合使用
@SpringBootTest
@TestPropertySource(
    locations = "classpath:test-defaults.properties",
    properties = "app.specific.setting=custom-value"
)
class CombinedPropertiesTest {
    // 组合使用属性文件和内联属性
}

// 与 Profiles 结合使用
@SpringBootTest
@TestPropertySource(properties = {
    "spring.profiles.active=test,integration"
})
class MultiProfileTest {
    // 激活多个 profiles
}

// 数据库测试专用配置
@DataJpaTest
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=true",
    "spring.datasource.url=jdbc:h2:mem:test;DB_CLOSE_DELAY=-1"
})
class DatabasePropertiesTest {
    // 为数据库测试专门配置的属性
}

// 测试特定业务配置
@SpringBootTest
@TestPropertySource(properties = {
    "app.payment.gateway.url=https://sandbox.payment.com",
    "app.payment.timeout=5000",
    "app.notification.enabled=false"
})
class BusinessConfigurationTest {
    
    @Value("${app.payment.gateway.url}")
    private String paymentUrl;
    
    @Value("${app.payment.timeout}")
    private int timeout;
    
    @Test
    void testConfiguration() {
        assertThat(paymentUrl).isEqualTo("https://sandbox.payment.com");
        assertThat(timeout).isEqualTo(5000);
    }
}
```

### 3. 属性注解

#### @MockBean
- 功能：在 Spring 测试上下文中替换现有 Bean 为 Mockito Mock 对象
- 特点：会替换整个应用上下文中的对应 Bean
- 位置：类级别或属性级别

```java
@SpringBootTest
public class UserServiceTest {
    @MockBean
    private UserRepository userRepository;
    
    // 测试方法
}
```

#### @SpyBean
- 功能：在 Spring 测试上下文中包装真实Bean，部分模拟 Spring Bean，保留原有行为
- 特点：可以监视真实 Bean 的方法调用，并在需要时进行模拟
- 位置：类级别或属性级别

#### @Autowired
- 功能：自动注入 Spring 容器中的 Bean
- 用途：在测试中获取需要测试或依赖的组件
- 位置：构造函数、方法、属性级别

#### @Value
- 功能：注入配置属性值
- 用途：在测试中获取配置文件中的属性值
- 位置：属性级别或方法参数级别

#### @Resource
- 功能：按名称或类型注入依赖项，是JSR-250标准注解
- 与@Autowired区别：
    - 默认优先按名称自动注入（字段名或指定 name），找不到回退到按类型
    - @Autowired默认按类型
- 参数：`name` - 指定注入的bean名称，`type` - 指定注入的bean类型
- 位置：字段级别、方法级别或构造函数参数级别

```java
@SpringBootTest
public class UserServiceTest {
    @Resource(name = "userRepository")
    private UserRepository userRepo;
    
    // 测试方法
}
```


#### @Container

- 功能：标记一个字段为 Testcontainers 容器实例，使其在测试生命周期中被自动管理（启动/停止）。
- 所属框架：Testcontainers（非 Spring Boot 原生注解，需额外依赖）。
- 特点：
    - 必须与 @Testcontainers 类注解配合使用；
    - 字段可以是 static（类级别容器）或 非 static（每个测试方法独立容器，较少用）；
    - 支持 Docker 容器（如 PostgreSQL、Redis、Kafka、Elasticsearch 等）；
    - 自动处理容器的启动、等待就绪、网络配置、资源清理。
- 适用场景：
    - 需要真实数据库/中间件进行集成测试；
    - 替代 H2 嵌入式数据库以获得更接近生产环境的行为；
    - 微服务依赖的外部服务模拟。

```java
@Testcontainers
@SpringBootTest
class UserServiceIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // 将容器的 JDBC URL 注入 Spring 环境
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private UserService userService;

    @Test
    void shouldSaveUserToRealPostgreSQL() {
        User user = new User("Alice", "alice@example.com");
        User saved = userService.save(user);
        assertThat(saved.getId()).isNotNull();
    }
}
```

## 二、关键工具类

### RestClient
- 功能：向真实启动的 HTTP 服务发送请求。
- 特点：
    - 需要启动 web 容器（通常配合`@SpringBootTest(webEnvironment = RANDOM_PORT)`）
- 适用场景：
    - 端到端的 HTTP 接口测试
    - 微服务间调用的消费者侧测试
    - 需要验证完整 HTTP 协议行为（Header、Status Code、Body）的场景

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest {

    @Autowired
    private RestClient.Builder restClientBuilder;

    private RestClient restClient;

    @BeforeEach
    void setUp(@LocalServerPort int port) {
        // 构建指向当前测试应用的 RestClient
        this.restClient = restClientBuilder
                .baseUrl("http://localhost:" + port)
                .build();
    }

    @Test
    void shouldReturnUserWhenExists() {
        // 发送 GET 请求并解析为 User 对象
        User response = restClient
                .get()
                .uri("/api/users/1")
                .retrieve()
                .body(User.class);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("张三");
    }

    @Test
    void shouldCreateNewUser() {
        User newUser = new User(null, "李四", "lisi@example.com");

        // 发送 POST 请求
        User created = restClient
                .post()
                .uri("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .body(newUser)
                .retrieve()
                .body(User.class);

        assertThat(created.getId()).isNotNull();
        assertThat(created.getEmail()).isEqualTo("lisi@example.com");
    }

    @Test
    void shouldHandleNotFoundGracefully() {
        // 自定义 404 处理逻辑
        assertThatThrownBy(() ->
            restClient.get()
                .uri("/api/users/999")
                .retrieve()
                .onStatus(HttpStatus::is4xxClientError, (req, res) -> {
                    throw new UserNotFoundException("User not found with ID 999");
                })
                .body(User.class)
        ).isInstanceOf(UserNotFoundException.class);
    }
}
```

### WebTestClient
- 功能：
    - 主要用于测试 Spring WebFlux（响应式）应用 的端点
    - 也可通过适配器间接测试 Spring MVC 应用，但需额外配置（非默认行为）
- 特点：
    - 基于响应式栈（Reactive），支持异步测试；
    - 提供流畅的 API，如 `get()`, `post()`, `put()`, `delete()` 等；
    - 支持 JSON 路径断言（如 `jsonPath()`）；
    - 可与 `@SpringBootTest` 配合使用，测试完整的请求处理流程。
    - 支持多种绑定模式：
        - 绑定到真实服务器（端到端测试）；
        - 绑定到单个控制器（bindToController()）；
        - 绑定到路由函数（bindToRouterFunction()，仅 WebFlux）；
        - 绑定到完整应用上下文（bindToApplicationContext()）。
- 与 Spring Boot 集成：
    - 在 WebFlux 项目中，可直接配合 @SpringBootTest + @AutoConfigureWebTestClient 使用；
    - 在 MVC 项目中，若想使用 WebTestClient，必须显式启用 MockMvc 适配器（见下方示例）。

```java
// Spring MVC 项目中使用 WebTestClient（需手动绑定 MockMvc）
// ⚠️ 注意：此时底层仍是 MockMvc，WebTestClient 只是提供了一层更现代的 API 封装。
@WebMvcTest(UserController.class)
class UserControllerWebTestClientTest {

    @Autowired
    private MockMvc mockMvc;

    private WebTestClient webTestClient;

    @BeforeEach
    void setUp() {
        // 通过 MockMvc 创建 WebTestClient
        this.webTestClient = MockMvcWebTestClient.bindTo(mockMvc).build();
    }

    @Test
    void testGetUser() {
        webTestClient.get().uri("/users/1")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.name").isEqualTo("张三");
    }
}
```
### MockMvc
- 功能：模拟 HTTP 请求，测试 MVC 控制器
- 特点：无需启动实际服务器，快速测试控制器逻辑
- 主要方法：`perform()`, `andExpect()`, `andDo()`, `andReturn()`

```java
@Autowired
private MockMvc mockMvc;

@Test
public void testGetUsers() throws Exception {
    mockMvc.perform(get("/api/users"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.length()").value(3));
}
```


### Mockito 相关类
- `Mockito`：核心工具类，提供 mock(), when(), verify() 等静态方法
- `ArgumentMatchers`：用于参数匹配，如 any(), eq() 等

## 三、测试层次与策略

### 1. 单元测试
- 测试单个组件，如 Service、Repository
- 使用 `@ExtendWith(MockitoExtension.class)`
- 使用 Mockito 模拟依赖

### 2. 集成测试
- 测试多个组件协同工作
- 使用 `@SpringBootTest` 或特定的切片测试注解

### 3. 控制器测试
- 使用 `@WebMvcTest` + `MockMvc` 进行模拟测试
- 或使用 `@SpringBootTest` + `RestClient` 进行实际请求测试

### 4. 数据访问层测试
- 使用 `@DataJpaTest` 测试 Repository
- 或使用 `@SpringBootTest` + 测试数据库进行完整测试

## 四、测试配置与技巧

### 1. 测试配置文件
- 使用 `application-test.properties` 或 `application-test.yml`
- 通过 `@ActiveProfiles("test")` 激活测试配置

```java
// 更现代的测试配置示例
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.url=jdbc:tc:postgresql:13:///testdb"
})
@ActiveProfiles("test")
class RepositoryTest {
    // 测试代码
}
```
### 2. 事务管理
- 测试方法默认在事务中执行，并在结束后回滚
- 可使用 `@Commit` 或 `@Rollback(false)` 提交事务

### 3. 测试生命周期
- `@BeforeEach`：每个测试方法执行前
- `@AfterEach`：每个测试方法执行后
- `@BeforeAll`：所有测试方法执行前（静态方法）
- `@AfterAll`：所有测试方法执行后（静态方法）

## 五、常用依赖

```xml
<!-- JUnit 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-api</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-engine</artifactId>
    <scope>test</scope>
</dependency>

<!-- Spring Boot Test -->
<!-- spring-boot-starter-test 已包含 JUnit 5、Mockito、AssertJ 等，无需单独声明 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- 若需使用 RestClient, 需引入 spring-boot-starter-web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Mockito -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>

<!-- 测试容器支持，按需引入 -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
```

## 六、完整的测试示例

### Controller 测试

```java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void testGetUserById() throws Exception {
        // 准备模拟数据
        User mockUser = new User(1L, "张三", "zhangsan@example.com");
        when(userService.getUserById(1L)).thenReturn(mockUser);

        // 执行测试
        mockMvc.perform(get("/api/users/1"))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.id").value(1))
               .andExpect(jsonPath("$.name").value("张三"));

        // 验证方法调用
        verify(userService).getUserById(1L);
    }
}
```

通过合理使用这些注解、类和接口，可以构建全面的测试套件，确保 Spring Boot 应用的质量和可靠性。

### 集成测试
```
@Testcontainers
@SpringBootTest
class IntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13");
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
    }
}
```

## 弃用/不建议使用的测试工具
- `TestRestTemplate`：用于发送实际 HTTP 请求的测试工具类，端到端的 HTTP 接口测试
    - 建议使用 `RestClient` 或 `WebTestClient`