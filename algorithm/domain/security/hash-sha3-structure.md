```mermaid
%%{init: {"flowchart": {"wrappingWidth": 2000}}}%%
flowchart TB
    %% 三个子图的标题都要左对齐。mermaid 的子图标题默认按子图宽度居中，会被上边下来的实线压到；
    %% 做法是塞一个固定像素宽的 div 把标题盒子撑到接近子图宽度，再用 text-align:left 把文字顶到左边。
    %% 宽度得≈子图自身宽度，所以三张各自手调，渲染后看差多少再改。
    subgraph S1["<div style='text-align:left;width:560px'>① 预处理阶段：补位、切块</div>"]
        direction LR
        A["任意长度消息"] --> B["补位：末尾补 1、若干 0，最后再补 1<br/>凑满 1088 位的整数倍"] --> C["切块<br/>每 1088 位一块"]
    end
    subgraph S2["<div style='text-align:left;width:640px'>② 吸收阶段：每块各做一次异或 + 置换</div>"]
        direction TB
        M1["块 1"]
        M2["块 2"]
        M3["块 N"]
        H0["状态起点<br/>1600 位全 0"] -->|"1600 位状态"| F1["第 1 次吸收<br/>异或 + 24 轮置换"] -->|"1600 位状态"| F2["第 2 次吸收<br/>异或 + 24 轮置换"] -->|"1600 位状态"| F3["第 N 次吸收<br/>异或 + 24 轮置换"]
    end
    subgraph S3["<div style='text-align:left;width:280px'>③ 挤压阶段</div>"]
        Z["取状态前 256 位 = 摘要"]
    end
    C --> M1
    C --> M2
    C --> M3
    M1 --> F1
    M2 --> F2
    M3 --> F3
    F3 --> Z
```
