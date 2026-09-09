---
title: 动态规划
date: 2025-07-08T06:12:54.613Z
category:
  - algorithm
  - dynamic-programming
tags:
  - algorithm
  - dynamic-programming
---

# 动态规划
[[toc]]

## 简介

<!-- @include:'./dynamic-programming-intro.md' -->

## 算法框架

动态规划有两种等价的实现方法：
- 自顶向下：按照递归形式编写程序，程序会保存每个子问题的解，当需要求解子问题时，首先检查是否已经保存过此解。如果有，则直接返回；否则，计算子问题的解并保存，以便下次使用。
- 自底向上：将子问题按照规模排序，按从小到大的顺序解决子问题，并保存每个子问题的解。然后，根据子问题的解，计算出原问题的解。

::: tip
两种方法的时间复杂度是相同的，仅有部分差异：自顶向下方法可能不会递归到所有的子问题，而自底向上的方法没有频繁的递归函数调用（用循环代替递归）。
:::

动态规划问题最重要的就是构造状态转移公式，有了状态转移公式后套用算法框架，注意处理边界值即可求解。
下面按照无循环、单层循环和双层循环分别给出两种方法的算法框架。

::: warning

这里的无循环是指状态转移公式中没有循环，类似`dp[i] =dp[i-1] + dp[i-2]`，每个值只与固定几个的值相关。自定向下方法的递归调用和状态转移公式形式类似，所以也是没有循环的。而自底向上方法会把递归调用转成了循环，所以会有单层循环，因为每个值只与前面固定的几个值相关，在自底向上方法中可以用变量代替数组，从而优化空间复杂度。

类似的单层循环是指状态转移公式中只有一层循环，对应自顶向下方法中有一层循环，而自底向上方法中会有双层循环。

:::

### 无循环

以状态转移公式为`dp[i] =dp[i-1] + dp[i-2]`为例，给出自顶向下和自底向上两种算法框架，并给出自底向上方法的优化空间的算法框架。

::: code-tabs
@tab 自顶向下
```java
// 保存每个子问题的解
int[] dp = new int[n+1];

public int dp(int[] nums, int n){
    // 边界条件
    if(n==0 || n==1)
        return 1; // 根据实际问题修改

    // 已计算出解的子问题直接返回
    if(dp[n]!=0)
        return dp[n];// 根据实际问题修改

    dp[n] = dp(n-1)+dp(n-2); // 根据实际问题修改
    return dp[n];
}
```
@tab 自底向上
```java
int[] dp = new int[n+1];

// 初始值
dp[0]=dp[1]=1;

public int dp(int[] nums){
    for(i=1;i<=n;i++){
        dp[i]=dp[i-1]+dp[i-2];
    }
    return dp[n];
}
```
@tab 自底向上优化空间
```java
public int dp(int[] nums){
    if(n==0 || n==1)
        return 1;
        
    int a = 1, b = 1;
    for(i=2;i<=n;i++){
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}
```
:::

### 单层循环

以状态转移公式为`dp[n] = max(nums[i]+dp[n-i]),1<=i<=n`为例，给出自顶向下和自底向上两种算法框架。
典型问题是钢条切割问题，即给定一段长度为`n`的钢条，求切割方案，使得总收益最大。

::: code-tabs
@tab 自顶向下
```java
// 保存每个子问题的解
int[] dp = new int[n+1];

public int dp(int[] nums, int n){
    // 边界条件
    if(n==0)
        return 0; // 根据实际问题修改

    // 已计算出解的子问题直接返回
    if(dp[n]!=0)
        return dp[n];// 根据实际问题修改

    // 不拆分子问题的解
    dp[n] = nums[n]; // 根据实际问题修改

    // 自顶向下计算子问题的解
    for(i=1; i<n; i++){// 注意i的取值范围是1到n
        dp[n] = Math.max(dp[n],nums[i]+dp(n-i));
    }
    return dp[n];
}
```
@tab 自底向上
```java
int[] dp = new int[n+1];

// 初始值
dp[0]=0;

public int dp(int[] nums){
    // 递归改循环，所以是双层循环
    for(i=1;i<=n;i++){  // 注意i的取值范围是1到n
      for(j=1;j<=i;j++){    // 注意j的取值范围是1到i
        dp[i]=max(dp[i],nums[j]+dp[i-j]);
      }
    }
    return dp[n];
}
```
:::

::: warning
注意事项：
  - 将dp数组长度设为`n+1`，可以方便处理边界条件。
  - 个人习惯：`0<=i<=n`，`1<=j<=i/n`。
    + 不一定要按照这里的取值范围来，按照自己的习惯组织代码即可，但一定要保持一致性，这样不容易出错。
:::

## 案例分析

### 斐波那契数列

#### 爬楼梯
题目描述: 有 N 阶楼梯，每次可以上一阶或者两阶，求有多少种上楼梯的方法。

::: tip
状态转移公式：`dp(i) = dp(i-1) + dp(i-2)`，其中`dp(0) = 1`和`dp(1) = 1`。
因为`dp(i)`只与`dp(i-1)`和`dp(i-2)`有关，所以可以使用两个变量来存储`dp(i-1)`和`dp(i-2)`的值，从而优化空间复杂度。
:::

::: code-tabs
@tab 自顶向下
```java
// 记录走到第i阶楼梯的方法数
int[] f = new int[n+1];

public int dp(int n){
    // 边界条件
    idp(n==0 || n==1)
        return 1;
    
    // 已计算出解的子问题直接返回
    idp(f[n]!=0)
        return f[n];
    
    // 自顶向下计算子问题的解
    f[n] = dp(n-1) + dp(n-2);
    return f[n];
}
```

@tab 自底向上
```java
// 记录每个阶梯的走法数
int[] f = new int[n+1];

// 初始值
f[0] = 1;
f[1] = 1;

public int dp(int n){
    for(i=2;i<=n;i++){
      f[i] = f[i-1] + f[i-2];
    }
    return f[n];
}
```
@tab 自底向上优化空间
```java
public int dp(int n){
  idp(n==0 || n==1)
    return 1;

  int a = 1, b = 1;

  // n=0和n=1的情况已经处理过了，所以从i=2开始
  for(i=2; i<=n; i++){
    int c = a + b;
    a = b;
    b = c;
  }
  return b;
}
```
:::

#### 强盗抢劫

题目描述: 抢劫一排住户，但是不能抢邻近的住户，求最大抢劫量。

::: tip
状态转移公式：`dp[i] = max(dp[i-1],dp[i-2]+nums[i])`，其中`dp[0] = 0`和`dp[1] = nums[0]`。
:::
::: code-tabs
@tab 自顶向下
```java
// 保存每个子问题的解
int[] dp = new int[n+1];

// 初始值
dp[0] = 0;
dp[1] = nums[0];

public int dp(int[] nums, int n){
    // 边界条件
    if(n==0)
        return 0;
    
    // 已计算出解的子问题直接返回
    if(dp[n]!=0)
        return dp[n];
    
    // 自顶向下计算子问题的解
    for(i=2; i<=n; i++){
        dp[i] = Math.max(dp(i-1),dp(i-2)+nums[i]);
    }
    return dp[n];
}
```

@tab 自底向上
```java
public int dp(int[] nums){
    // 保存每个子问题的解
    int[]dp=new int[n+1];
    for(int i=1;i<=n;i++){
        dp[i]=Math.max(dp[i-1],dp[i-2]+nums[i])
    }
  return dp[n];
}
```

@tab 自底向上优化空间
```java
public int dp(int[] nums){
    if(nums.length==0)
        return 0;
    int a = 0, b = nums[0];
    int n = nums.length;
   for(i=2;i<=n;i++){
       int c = max(b,a+nums[i]);
       a = b;
       b = c;
   }
  return b;
}
```
:::

#### 强盗在环形街区抢劫

题目描述: 抢劫环形街区住户，但是不能抢邻近的住户，求最大抢劫量。

::: tip
按照是否抢劫第一个住户，可以将问题分为两种情况：
- 不抢劫第一个住户：抢劫第2个至第n个用户。
- 抢劫第一个住户：抢劫第2个至第n-1个用户。
选择这两种情况的最大值即可。
:::

::: code-tabs
@tab 自底向上优化空间
```java
public int dp(int[] nums){
    return Math.max(dp(nums,0,n-1),dp(nums,1,n));
}
// start 表示从第 start 号住户开始抢劫，0 <= start <= n-1
// end 表示抢劫到第 end 号住户（不包含第end号住户），1 <= end <= n
public int dp(int[] nums, int start, int end){
    if(nums.length==0 || start==end)
        return 0;
    int a = 0, b = nums[start];
    // 当 end = n-1 时，表示抢劫第n-2个住户，不会抢劫第n-1个住户（即不抢劫最后一个住户）
   for(i=start+1; i<end; i++){
       int c = max(b,a+nums[i]);
       a = b;
       b = c;
   }
  return b;
}
```
:::

### 矩阵路径
求从矩阵的左上角到右下角的最小路径和，每次只能向右和向下移动。
[[1,3,1],
 [1,5,1],
 [4,2,1]]
::: tip
状态转移公式：`dp[i][j] = min(dp[i-1][j],dp[i][j-1]) + matrix[i-1][j-1]`，其中
- `1<=i<=m`，`1<=j<=n`
- `dp[0][j] = dp[i][0] = Integer.MAX_VALUE` ，表示边界的路径选择只有一种，即最右边只能选择向下，最下边只能选择向右。
- `dp[1][1] = matrix[0][0]`，右下角的路径不能套公式，否则会出现+∞的情况。
:::

::: code-tabs

@tab 自顶向下
```java
// 保存每个子问题的解
int[][] dp = new int[m+1][n+1];
// 初始值
for(i=0;i<=m;i++){
    for(j=0;j<=n;j++){
      if(i==0||j==0){
        dp[i][j]=Integer.MAX_VALUE;
      }
    }
}

public int dp(int[][] matrix){
    int m = matrix.length;
    int n = matrix[0].length;
    
    for(i=1;i<=m;i++){
        for(j=1;j<=n;j++){
            if(i==1 && j==1) {
                dp[i][j] = matrix[0][0];
            } else {
               dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + matrix[i-1][j-1];
           }
        }
    }
    return dp[m][n];
}
```

@tab 自底向上
```java
public int dp(int[][] matrix){
    // 保存每个子问题的解
    int[][] dp = new int[m+1][n+1];

    // 初始值
    for(i=0;i<=m;i++){
        for(j=0;j<=n;j++){
          if(i==0||j==0){
            dp[i][j]=Integer.MAX_VALUE;
          }
        }
    }

    for(i=1;i<=m;i++){
        for(j=1;j<=n;j++){
            if(i==1 && j==1) {
                dp[i][j] = matrix[0][0];
            } else {
                dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + matrix[i][j];
            }
        }
    }
}
```

@tab 自底向上优化空间
```java
public int dp(int[][] matrix){
  // 保存每个子问题的解
  int[][] dp = new int[m+1][n+1];

  // 初始值
  for(i=0;i<=m;i++){
    for(j=0;j<=n;j++){
      if(i==0||j==0){
        dp[i][j]=Integer.MAX_VALUE;
      }
    }
  }

  for(i=1;i<=m;i++){
    for(j=1;j<=n;j++){
      if(i==1 && j==1) {
        dp[i][j] = matrix[0][0];
      } else {
        dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + matrix[i][j];
      }
    }
  }
}
```
:::

### 钢条切割问题
将长钢条切割为锻钢条出售，切割工序本身没有任何成本指出，出售一段长度为`i`的钢条的价格为`p[i]`，求切割方案，使得总收益`r[n]`最大。

::: tip
状态转移公式：`r[i] = max(r[i],p[j]+cut(p,n-j))`，其中
- `p`表示价格数组
- `n`表示钢条数量
- `j`表示切割钢条的长度，取值范围为`1`到`i`。
:::

::: code-tabs
@tab 自顶向下
```java
// 记录每个长度的最大收益
int[] r = new int[n+1]; 

// p 数组表示钢条价格，n 表示钢条数量
public int cut(int[] p, int n){
    // 边界条件
    if(n==0)
        return 0;
    
    // 已经计算过的子问题的解
    if(r[n]!=0)
        return r[n];
    
    // 初始值为不切割的收益
    q=p[n];
    
    // 遍历所有切割方案
    for(i=0;i<n;i++){
        // q：不切割
        // p[i]：切割i英尺的钢条的收益
        // cut(p,n-i)：切割剩余钢条的最大收益
        q=Math.max(q,p[i]+cut(p,n-i));
    }
    
    // 记录最大收益
    r[n]=q;
    return r[n];
}
```

@tab 自底向上
```java
// 记录每个长度的最大收益
int[] r = new int[n+1];
// 初始值
r[0]=0;

// p 数组表示钢条价格，n 表示钢条数量
public int cut(int[] p, int n){
    for(i=1;i<=n;i++){
      for(j=1;j<=i;j++){
        // r[i]：i英尺钢条的最大收益
        // p[j]：切割j英尺的钢条的收益
        // r[i-j]：切割剩余钢条的最大收益
        r[i]=max(r[i],p[j]+r[i-j]);
      }
    }
    return r[n];
}
```
:::

<!-- todo 给出钢条切割问题的最优切割方案 -->

### 矩阵链乘法问题

### 最长公共子序列问题

### 最优二叉搜索树问题
