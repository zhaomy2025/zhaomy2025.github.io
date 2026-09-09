# Mockito 模拟框架

Mockito是Java生态系统中最流行的模拟框架之一，它提供了简洁优雅的API来创建和配置mock对象，使得单元测试更加简单可靠。

## 简介与核心概念

### 什么是Mockito

Mockito是一个开源的Java测试框架，专门用于创建和配置mock对象。它允许您模拟复杂对象的行为，从而专注于测试单个类或方法，而不需要依赖完整的系统环境。

### 为什么需要模拟框架

在单元测试中，我们经常遇到以下挑战：
- 外部依赖：被测试类依赖于数据库、网络服务等外部系统
- 复杂初始化：某些对象创建成本很高或需要复杂配置
- 不可控因素：时间、随机数、外部状态等难以控制的因素
- 测试隔离：确保测试之间不会相互影响

Mockito通过创建轻量级的模拟对象来解决这些问题。

### Mockito vs 其他模拟框架对比

| 特性 | Mockito | EasyMock | JMock |
|------|---------|----------|-------|
| 语法简洁性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 学习曲线 | 平缓 | 中等 | 陡峭 |
| 注解支持 | 完整 | 有限 | 有限 |
| 部分模拟 | 支持 | 支持 | 支持 |
| 静态方法 | 支持(3.4+) | 不支持 | 不支持 |

## 快速入门

### 环境配置与依赖引入

Maven依赖：

```xml

<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.7.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>5.7.0</version>
    <scope>test</scope>
</dependency>

```

### 第一个Mockito测试

让我们从一个简单的例子开始：

```java

// 被测试的类
public class UserService {
    private UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public String getUserName(Long userId) {
        User user = userRepository.findById(userId);
        return user != null ? user.getName() : "Unknown";
    }
}

// 测试类
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {
    
    @Test
    void testGetUserName() {
        // 创建mock对象
        UserRepository mockRepository = mock(UserRepository.class);
        
        // 配置mock行为
        when(mockRepository.findById(1L))
            .thenReturn(new User(1L, "Alice"));
        
        // 创建被测试对象并注入mock
        UserService userService = new UserService(mockRepository);
        
        // 执行测试
        String result = userService.getUserName(1L);
        
        // 验证结果
        assertEquals("Alice", result);
        
        // 验证mock方法被调用
        verify(mockRepository).findById(1L);
    }
}

```

### 基本API概览

| 方法 | 用途 | 示例 |
|------|------|------|
| `mock(Class<T> classToMock)` | 创建mock对象 | `List<String> mockedList = mock(List.class)` |
| `when(methodCall)` | 设置预期行为 | `when(mock.get(0)).thenReturn("first")` |
| `verify(mock)` | 验证方法调用 | `verify(mock).add("one")` |
| `verifyNoMoreInteractions(mock)` | 验证无额外调用 | `verifyNoMoreInteractions(mock)` |

## 核心功能详解

### 创建Mock对象

#### mock()方法

```java

// 基本用法
List<String> mockedList = mock(List.class);

// 带名称的mock（便于调试）
List<String> mockedList = mock(List.class, "myList");

// 使用MockSettings进行高级配置
List<String> mockedList = mock(List.class, withSettings()
    .name("myList")
    .verboseLogging()
    .defaultAnswer(RETURNS_SMART_NULLS));

```

#### @Mock注解

```java

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void testWithAnnotations() {
        when(userRepository.findById(anyLong()))
            .thenReturn(new User(1L, "Bob"));
        
        String result = userService.getUserName(1L);
        assertEquals("Bob", result);
    }
}

```

#### MockSettings高级配置

```java

// 创建序列化支持的mock
List<String> serializableMock = mock(List.class, withSettings()
    .serializable());

// 创建额外接口的mock
List<String> mockWithExtraInterfaces = mock(ArrayList.class, 
    withSettings().extraInterfaces(Cloneable.class));

```

### Stubbing打桩机制

#### when()/thenReturn()

```java

@Test
void testStubbing() {
    // 基本返回值
    when(mockRepository.findById(1L))
        .thenReturn(new User(1L, "Alice"));
    
    // 多个返回值（按顺序）
    when(mockRepository.count())
        .thenReturn(10L)
        .thenReturn(11L)
        .thenReturn(12L);
    
    // 第一次调用返回10，第二次返回11，之后都返回12
    assertEquals(10L, mockRepository.count());
    assertEquals(11L, mockRepository.count());
    assertEquals(12L, mockRepository.count());
}

```

#### thenThrow()/thenAnswer()

```java

@Test
void testExceptionHandling() {
    // 抛出异常
    when(mockRepository.findById(999L))
        .thenThrow(new UserNotFoundException("User not found"));
    
    // 动态计算返回值
    when(mockRepository.save(any(User.class)))
        .thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(System.currentTimeMillis());
            return user;
        });
}

```

#### 连续调用处理

```java

@Test
void testConsecutiveCalls() {
    // 第一次返回"yes"，第二次返回"no"，之后返回"maybe"
    when(mock.decision())
        .thenReturn("yes")
        .thenReturn("no")
        .thenReturn("maybe");
    
    // 简化写法
    when(mock.decision())
        .thenReturn("yes", "no", "maybe");
}

```

### 验证行为

#### verify()基础用法

```java

@Test
void testVerifyBasic() {
    // 执行测试
    userService.updateUser(1L, "New Name");
    
    // 验证方法被调用
    verify(userRepository).update(1L, "New Name");
    
    // 验证调用次数
    verify(userRepository, times(1)).update(anyLong(), anyString());
    
    // 验证至少调用一次
    verify(userRepository, atLeastOnce()).update(anyLong(), anyString());
    
    // 验证最多调用两次
    verify(userRepository, atMost(2)).update(anyLong(), anyString());
}

```

#### 验证调用次数

```java

@Test
void testCallCounts() {
    userService.getUserName(1L);
    userService.getUserName(1L);
    userService.getUserName(2L);
    
    // 验证具体调用次数
    verify(userRepository, times(2)).findById(1L);
    verify(userRepository, times(1)).findById(2L);
    
    // 验证调用范围
    verify(userRepository, atLeast(1)).findById(1L);
    verify(userRepository, atMost(3)).findById(anyLong());
}

```

#### 验证调用顺序

```java

@Test
void testCallOrder() {
    List<String> mockList = mock(List.class);
    
    mockList.add("first");
    mockList.add("second");
    
    // 验证调用顺序
    InOrder inOrder = inOrder(mockList);
    inOrder.verify(mockList).add("first");
    inOrder.verify(mockList).add("second");
}

```

#### 验证从未调用

```java

@Test
void testNeverCalled() {
    // 验证方法从未被调用
    verify(userRepository, never()).delete(anyLong());
    
    // 验证零次交互
    verifyZeroInteractions(userRepository);
    
    // 验证无更多交互
    verify(userRepository).findById(1L);
    verifyNoMoreInteractions(userRepository);
}

```

## 高级特性

### Spy部分模拟

```java

@Test
void testSpy() {
    // 创建spy对象（真实对象+部分mock）
    List<String> spyList = spy(new ArrayList<>());
    
    // 默认调用真实方法
    spyList.add("real");
    assertEquals(1, spyList.size());
    
    // 可以stub特定方法
    when(spyList.size()).thenReturn(100);
    assertEquals(100, spyList.size());
    
    // 验证真实方法调用
    verify(spyList).add("real");
}

```

### ArgumentMatchers参数匹配器

```java

@Test
void testArgumentMatchers() {
    // 任意值匹配
    when(userRepository.findById(anyLong()))
        .thenReturn(new User(1L, "Any User"));
    
    // 字符串匹配
    when(userRepository.findByName(eq("Alice")))
        .thenReturn(new User(1L, "Alice"));
    
    // 自定义匹配器
    when(userRepository.findByName(argThat(name -> name.length() > 3)))
        .thenReturn(new User(1L, "Long Name"));
    
    // 组合匹配器
    when(userRepository.findByName(and(contains("Bob"), endsWith("Jr"))))
        .thenReturn(new User(2L, "Bob Jr"));
}

```

### BDD风格测试

```java

@Test
void testBDDStyle() {
    // Given
    given(userRepository.findById(1L))
        .willReturn(new User(1L, "Alice"));
    
    // When
    String result = userService.getUserName(1L);
    
    // Then
    assertThat(result).isEqualTo("Alice");
    then(userRepository).should().findById(1L);
}

```

### 自定义Answer

```java

@Test
void testCustomAnswer() {
    when(userRepository.save(any(User.class)))
        .thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            if (user.getName() == null || user.getName().isEmpty()) {
                throw new IllegalArgumentException("Name cannot be empty");
            }
            user.setId(System.nanoTime());
            return user;
        });
}

```

### Mock静态方法（Mockito 3.4+）

```java

// 需要mockito-inline依赖
@Test
void testStaticMock() {
    try (MockedStatic<LocalDateTime> mockedStatic = mockStatic(LocalDateTime.class)) {
        LocalDateTime fixedDateTime = LocalDateTime.of(2023, 12, 25, 10, 30);
        mockedStatic.when(LocalDateTime::now).thenReturn(fixedDateTime);
        
        assertEquals(fixedDateTime, LocalDateTime.now());
    }
}

```

## 注解驱动测试

### 常用注解

```java

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Spy
    private UserMapper userMapper = new UserMapper();
    
    @Captor
    private ArgumentCaptor<User> userCaptor;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void testWithAnnotations() {
        // 测试代码...
    }
}

```

### Spring Boot集成

```java

@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void testGetUserEndpoint() throws Exception {
        when(userService.getUserName(1L)).thenReturn("Alice");
        
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Alice"));
    }
}

```

## 最佳实践

### 测试命名规范

```java

// 好的命名示例
@Test
void shouldReturnUserNameWhenUserExists() {
    // given
    given(userRepository.findById(1L)).willReturn(new User(1L, "Alice"));
    
    // when
    String result = userService.getUserName(1L);
    
    // then
    assertThat(result).isEqualTo("Alice");
}

@Test
void shouldThrowExceptionWhenUserNotFound() {
    // given
    given(userRepository.findById(999L)).willReturn(null);
    
    // when & then
    assertThatThrownBy(() -> userService.getUserName(999L))
        .isInstanceOf(UserNotFoundException.class);
}

```

### Mock vs Spy的选择

使用Mock的情况：
- 依赖是接口或抽象类
- 需要完全控制依赖行为
- 不需要依赖的真实逻辑

使用Spy的情况：
- 依赖是具体类且需要部分真实行为
- 需要验证真实方法的调用
- 只需要stub少量方法

### 避免过度Mocking

```java

// ❌ 过度Mocking
@Test
void testWithTooManyMocks() {
    // 创建了太多mock，测试变得复杂
    UserRepository userRepo = mock(UserRepository.class);
    EmailService emailService = mock(EmailService.class);
    NotificationService notificationService = mock(NotificationService.class);
    // ... 更多mock
}

// ✅ 合理的mock数量
@Test
void testWithAppropriateMocks() {
    // 只mock必要的依赖
    UserRepository userRepo = mock(UserRepository.class);
    UserService userService = new UserService(userRepo);
    // ... 简洁的测试
}

```

### 测试可读性优化

```java

@Test
void shouldSaveUserWithEncryptedPassword() {
    // given
    User user = User.builder()
        .name("Alice")
        .email("alice@example.com")
        .password("plain123")
        .build();
    
    given(encryptionService.encrypt("plain123"))
        .willReturn("encrypted123");
    
    // when
    userService.registerUser(user);
    
    // then
    then(userRepository).should().save(argThat(savedUser ->
        savedUser.getPassword().equals("encrypted123")
    ));
}

```

## 常见问题与解决方案

### 常见错误解析

问题1: Unfinished stubbing

```java

// ❌ 错误写法
when(userRepository.findById(anyLong()));
thenReturn(new User());

// ✅ 正确写法
when(userRepository.findById(anyLong()))
    .thenReturn(new User());

```

问题2: Invalid use of argument matchers

```java

// ❌ 错误写法
when(userRepository.findById(anyLong())).thenReturn(user);
verify(userRepository).findById(1L); // 这里也需要匹配器

// ✅ 正确写法
when(userRepository.findById(anyLong())).thenReturn(user);
verify(userRepository).findById(eq(1L));

```

### 调试技巧

```java

@Test
void testWithDebugInfo() {
    // 启用详细日志
    Mockito.framework().addListener(new MockitoListener() {
        @Override
        public void onMockCreated(MockCreationEvent event) {
            System.out.println("Mock created: " + event.getMock());
        }
    });
    
    // 使用@Mock的name属性
    @Mock(name = "userRepository")
    private UserRepository userRepository;
}

```

### 性能优化建议

1. 重用mock对象：在@BeforeEach中初始化常用mock
2. 避免过度验证：只验证重要的交互
3. 使用@Mock注解：减少样板代码
4. 合理组织测试：相关的测试放在同一个测试类中

## 实战案例

### Service层测试

```java

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    
    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private PaymentService paymentService;
    
    @Mock
    private InventoryService inventoryService;
    
    @InjectMocks
    private OrderService orderService;
    
    @Test
    void shouldCreateOrderSuccessfully() {
        // given
        OrderRequest request = new OrderRequest(1L, Arrays.asList(1L, 2L));
        
        given(inventoryService.checkAvailability(anyList()))
            .willReturn(true);
        given(paymentService.processPayment(anyLong(), any(BigDecimal.class)))
            .willReturn(new PaymentResult("SUCCESS", "TX123"));
        given(orderRepository.save(any(Order.class)))
            .willAnswer(invocation -> {
                Order order = invocation.getArgument(0);
                order.setId(100L);
                return order;
            });
        
        // when
        OrderResult result = orderService.createOrder(request);
        
        // then
        assertThat(result).isNotNull();
        assertThat(result.getOrderId()).isEqualTo(100L);
        assertThat(result.getStatus()).isEqualTo("CONFIRMED");
        
        then(inventoryService).should().checkAvailability(Arrays.asList(1L, 2L));
        then(paymentService).should().processPayment(eq(1L), any(BigDecimal.class));
        then(orderRepository).should().save(any(Order.class));
    }
}

```

### Repository层测试

```java

@ExtendWith(MockitoExtension.class)
class UserRepositoryTest {
    
    @Mock
    private EntityManager entityManager;
    
    @Mock
    private Query query;
    
    @InjectMocks
    private UserRepositoryImpl userRepository;
    
    @Test
    void shouldFindActiveUsers() {
        // given
        List<User> expectedUsers = Arrays.asList(
            new User(1L, "Alice", true),
            new User(2L, "Bob", true)
        );
        
        given(entityManager.createQuery(anyString(), eq(User.class)))
            .willReturn(query);
        given(query.setParameter("active", true)).willReturn(query);
        given(query.getResultList()).willReturn(expectedUsers);
        
        // when
        List<User> activeUsers = userRepository.findActiveUsers();
        
        // then
        assertThat(activeUsers).hasSize(2);
        assertThat(activeUsers).allMatch(User::isActive);
    }
}

```

### Controller层测试

```java

@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void shouldReturnUserDetails() throws Exception {
        // given
        User user = new User(1L, "Alice", "alice@example.com");
        given(userService.getUserById(1L)).willReturn(user);
        
        // when & then
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.name").value("Alice"))
            .andExpect(jsonPath("$.email").value("alice@example.com"));
        
        then(userService).should().getUserById(1L);
    }
}

```

### 复杂业务场景测试

```java

@Test
void shouldHandleConcurrentOrderCreation() {
    // 使用ArgumentCaptor捕获参数
    ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
    
    // 模拟并发场景
    ExecutorService executor = Executors.newFixedThreadPool(3);
    List<CompletableFuture<OrderResult>> futures = new ArrayList<>();
    
    for (int i = 0; i < 5; i++) {
        final int orderId = i;
        futures.add(CompletableFuture.supplyAsync(() -> {
            OrderRequest request = new OrderRequest(orderId, Arrays.asList(1L, 2L));
            return orderService.createOrder(request);
        }, executor));
    }
    
    // 等待所有订单完成
    CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
    
    // 验证所有订单都被正确处理
    verify(orderRepository, times(5)).save(orderCaptor.capture());
    List<Order> capturedOrders = orderCaptor.getAllValues();
    assertThat(capturedOrders).hasSize(5);
}

```

## 集成与扩展

### 与Spring Boot集成

Spring Boot Starter Test包含：
- Mockito Core
- Mockito JUnit Jupiter
- 自动配置支持

```xml

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

```

### 与JUnit 5集成

```java

@ExtendWith(MockitoExtension.class)
class JUnit5IntegrationTest {
    
    @Mock
    private Collaborator collaborator;
    
    @InjectMocks
    private SystemUnderTest systemUnderTest;
    
    @BeforeEach
    void setUp() {
        // 初始化代码
    }
    
    @AfterEach
    void tearDown() {
        // 清理代码
    }
}

```

### 与AssertJ集成

```java

@Test
void testWithAssertJ() {
    // 使用AssertJ进行更丰富的断言
    assertThat(userService.getAllUsers())
        .isNotEmpty()
        .hasSize(3)
        .extracting(User::getName)
        .contains("Alice", "Bob", "Charlie");
    
    // 验证mock交互
    assertThat(Mockito.mockingDetails(userRepository).getInvocations())
        .hasSize(1)
        .extracting("method.name")
        .contains("findAll");
}

```

## 总结与进阶学习

### 学习路径建议

1. 基础阶段：掌握mock创建、stubbing、验证
2. 进阶阶段：学习spy、参数匹配器、BDD风格
3. 高级阶段：掌握静态mock、并发测试、复杂场景
4. 实战阶段：在真实项目中应用最佳实践

### 官方文档推荐

- [Mockito官方文档](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Mockito GitHub仓库](https://github.com/mockito/mockito)
- [BDDMockito文档](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/BDDMockito.html)

### 相关工具介绍

- Mockito-Kotlin: Kotlin专用的Mockito扩展
- MockK: Kotlin原生的mock框架
- PowerMock: 支持静态方法、构造函数等高级特性
- MockServer: 用于HTTP服务模拟

Mockito通过其简洁的API和强大的功能，已成为Java单元测试的事实标准。掌握Mockito不仅能提高测试质量，还能促进更好的代码设计和架构。