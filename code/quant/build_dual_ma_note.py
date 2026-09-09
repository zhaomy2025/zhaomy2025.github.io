"""生成双均线笔记 README.md：把回测数据内嵌为 echarts，避免手贴大段 JSON。

来源写这里、重跑即重建，避免手改 README 被覆盖。
含章节：回测框架 / 参数扫描 / 样本外验证 / 多标的验证（并入原 beyond-dual-ma 内容）。
"""
import os
import json

HERE = os.path.dirname(os.path.abspath(__file__))
ARTICLE_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "quant", "dual-ma"))


def load_small(name):
    with open(os.path.join(ARTICLE_DIR, name), encoding="utf-8") as f:
        return json.load(f)


# ---------------- 双均线（茅台）主图数据 ----------------
d = load_small("dual_ma_equity_small.json")
dates = d["dates"]
equity = d["equity"]
buyhold = d["buyhold"]
close = d["close"]
ma_fast = d["ma_fast"]
ma_slow = d["ma_slow"]

opt_nav = {
    "tooltip": {"trigger": "axis"},
    "legend": {"data": ["双均线策略", "买入持有"]},
    "grid": {"left": 50, "right": 20, "top": 40, "bottom": 60},
    "xAxis": {"type": "category", "data": dates, "axisLabel": {"rotate": 45}},
    "yAxis": {"type": "value", "name": "净值(起始=1)"},
    "dataZoom": [{"type": "inside"}, {"type": "slider"}],
    "series": [
        {"name": "双均线策略", "type": "line", "data": equity, "showSymbol": False, "lineStyle": {"width": 2}},
        {"name": "买入持有", "type": "line", "data": buyhold, "showSymbol": False, "lineStyle": {"width": 2, "color": "#9ca3af"}},
    ],
}

opt_ma = {
    "tooltip": {"trigger": "axis"},
    "legend": {"data": ["收盘价", "快线(MA5)", "慢线(MA20)"]},
    "grid": {"left": 50, "right": 20, "top": 40, "bottom": 60},
    "xAxis": {"type": "category", "data": dates, "axisLabel": {"rotate": 45}},
    "yAxis": {"type": "value", "scale": True, "name": "价格(前复权)"},
    "dataZoom": [{"type": "inside"}, {"type": "slider"}],
    "series": [
        {"name": "收盘价", "type": "line", "data": close, "showSymbol": False, "color": "#9ca3af", "lineStyle": {"width": 2}},
        {"name": "快线(MA5)", "type": "line", "data": ma_fast, "showSymbol": False, "color": "#f59e0b", "lineStyle": {"width": 2}},
        {"name": "慢线(MA20)", "type": "line", "data": ma_slow, "showSymbol": False, "color": "#7c3aed", "lineStyle": {"width": 2}},
    ],
}

nav_json = json.dumps(opt_nav, ensure_ascii=False)
ma_json = json.dumps(opt_ma, ensure_ascii=False)

# ---------------- 样本外净值（冠军 vs 默认 vs 买入持有，2023-2025） ----------------
oos = load_small("dual_ma_oos_small.json")
cp = oos["champ_params"]
opt_oos = {
    "tooltip": {"trigger": "axis"},
    "legend": {"data": [f"样本内冠军(快{cp[0]}/慢{cp[1]})", "默认(快5/慢20)", "买入持有"]},
    "grid": {"left": 50, "right": 20, "top": 40, "bottom": 60},
    "xAxis": {"type": "category", "data": oos["dates"], "axisLabel": {"rotate": 45}},
    "yAxis": {"type": "value", "name": "净值(起始=1)", "scale": True},
    "dataZoom": [{"type": "inside"}, {"type": "slider"}],
    "series": [
        {"name": f"样本内冠军(快{cp[0]}/慢{cp[1]})", "type": "line",
         "data": oos["champ_equity"], "showSymbol": False,
         "lineStyle": {"width": 2, "color": "#7c3aed"}},
        {"name": "默认(快5/慢20)", "type": "line",
         "data": oos["default_equity"], "showSymbol": False,
         "lineStyle": {"width": 2, "color": "#f59e0b"}},
        {"name": "买入持有", "type": "line",
         "data": oos["buyhold"], "showSymbol": False,
         "lineStyle": {"width": 2, "color": "#9ca3af"}},
    ],
}
oos_json = json.dumps(opt_oos, ensure_ascii=False)

# ---------------- 多标的验证（原 beyond-dual-ma） ----------------
b = json.load(open(os.path.join(HERE, "beyond_dual_ma.json"), encoding="utf-8"))
brows = b["rows"]
bnav = b["nav"]

PALETTE = {"600519": "#2563eb", "600036": "#16a34a", "000858": "#f59e0b",
           "601318": "#7c3aed", "300750": "#ef4444"}

# 下采样到 ~300 点，避免 README 过大（各标的日期序列同源，按下标统一抽稀）
ref_full = bnav["600519"]["dates"]
step = max(1, len(ref_full) // 300)
idx = list(range(0, len(ref_full), step))
if idx[-1] != len(ref_full) - 1:
    idx.append(len(ref_full) - 1)
ref_dates = [ref_full[i] for i in idx]

series = []
for code, dd in bnav.items():
    c = PALETTE.get(code, "#888")
    eq = [dd["equity"][i] for i in idx]
    series.append({
        "name": dd["name"], "type": "line", "showSymbol": False, "smooth": True,
        "lineStyle": {"width": 1.5, "color": c}, "itemStyle": {"color": c}, "data": eq,
    })
# 买入持有参照（茅台，灰虚线，与双均线约定同色）
bh = [bnav["600519"]["buyhold"][i] for i in idx]
series.append({
    "name": "茅台·买入持有(参照)", "type": "line", "showSymbol": False,
    "lineStyle": {"width": 1.5, "type": "dashed", "color": "#9ca3af"},
    "itemStyle": {"color": "#9ca3af"}, "data": bh,
})
opt_beyond = {
    "tooltip": {"trigger": "axis"},
    "legend": {"data": [s["name"] for s in series]},
    "grid": {"left": 55, "right": 30, "top": 45, "bottom": 75},
    "xAxis": {"type": "category", "data": ref_dates, "boundaryGap": False},
    "yAxis": {"type": "value", "name": "净值(首日=1)", "scale": True},
    "dataZoom": [{"type": "inside"}, {"type": "slider", "bottom": 12}],
    "series": series,
}
beyond_nav_json = json.dumps(opt_beyond, ensure_ascii=False)


def pct(x):
    return f"{x*100:.2f}%" if x is not None else "—"


table_rows = ""
for r in brows:
    table_rows += (f"| {r['name']} | {pct(r['total_return'])} | {pct(r['buyhold_return'])} | "
                   f"{'跑赢' if r['beat'] else '跑输'} | {r['sharpe']:.2f} | "
                   f"{pct(r['max_drawdown'])} | {r['n_trades']} | {pct(r['oos_return'])} |\n")

md = f"""---
title: 双均线策略
date: 2026-09-02
category: 量化
tags:
  - 量化
  - 双均线
  - 回测
  - Python
---

# 双均线策略：用贵州茅台真实数据跑通一个完整回测闭环

[[toc]]

## 一句话结论

双均线（金叉买入、死叉卖出）是量化入门的"Hello World"。但用**真实 A 股数据**跑一遍你会发现一件反直觉的事：**在贵州茅台这种长期上涨的股票上，双均线策略大幅跑输"买入持有"**（2018-2025，策略 +30% vs 持有 +222%）。它不是因为"策略垃圾"，而是因为单边市里反复假突破的摩擦成本会吃掉收益。

::: warning 先记住这个坑
回测里"看起来能赚钱"和"真的能赚钱"之间，差的就是**真实数据 + 真实成本 + 样本外验证**这三件事。前两件上面已经做实；第三件（样本外）见下方「样本外验证」一节——用 2018-2022 调参、2023-2025 验证，检验冠军参数到了没见过的未来还灵不灵。
:::

## 为什么不用 vectorbt，而是自己写

vectorbt 是很好的回测引擎，但它**要求 Python ≤ 3.11**，当前环境装不上。这反而逼我们走了更对的一步：**自己写一个 150 行的极简回测**。

> 回测引擎是"基础设施"，不是"资产"。新手最容易掉的时间黑洞，就是花半年手写复权、停牌、撮合、分红送股，最后得了个不好用的引擎，策略一个没验证。

自写回测的价值不在"造轮子"，在于**把引擎从黑盒变白盒**——你会突然明白：快/慢均线为什么存在、信号为什么要滞后一天成交（避免未来函数）、成本为什么要单列。这些理解，用现成引擎是得不到的。

## 回测引擎到底在干什么（白盒拆解）

一个长仓-only 的双均线回测，核心就五步：

1. **算均线**：`MA_fast = close.rolling(5).mean()`，`MA_slow = close.rolling(20).mean()`
2. **出信号**：快线在慢线上方 → 持仓(1)，否则空仓(0)
3. **次日成交**：信号 `shift(1)`，用**下一天收盘价**成交。这一步关键——用当天信号当天成交会引入"未来函数"，回测虚高
4. **扣成本**：A 股真实成本 = 佣金(万3 双边) + 印花税(万5 仅卖出) + 滑点(约0.1% 单边，近似涨跌停无法成交)
5. **算指标**：净值曲线、最大回撤、胜率、夏普、交易次数

::: tip A 股真实约束
- **T+1**：当天买的不能当天卖。日线策略里用"次日收盘成交"近似即可
- **不能做空**：本文只做多，持仓只有 0/1 两态
- **涨跌停**：极端日无法按市价成交，用滑点近似；严谨回测要单独处理
:::

## 真实数据跑出来的结果

数据：akshare 前复权日线 **贵州茅台 600519**，2018-01-02 ~ 2025-12-31，共 1942 根。

| 指标 | 双均线(快5/慢20) | 买入持有 |
| --- | --- | --- |
| 总收益 | 30.20% | 221.96% |
| 年化收益 | 3.48% | 16.0%* |
| 最大回撤 | -49.64% | (同标的) |
| 夏普(近似) | 0.26 | — |
| 年化波动 | 26.11% | — |
| 交易次数 | 64 | 1 |
| 胜率 | 26.56% | — |

> *买入持有年化按 (1+221.96%)^(1/8)-1 估算，约 16%。

**净值曲线**（可拖拽缩放）：

```echarts
{nav_json}
```

**价格与双均线**（金叉/死叉一目了然）：

```echarts
{ma_json}
```

## 参数扫描：过拟合长什么样

同一只票、同一套逻辑，只换快慢均线参数，结论天差地别：

| 快 | 慢 | 总收益 | 年化 | 回撤 | 夏普 | 胜率 | 次数 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 15 | 50 | 195.67% | 15.10% | -37.08% | 0.68 | 43.48% | 23 |
| 15 | 60 | 160.60% | 13.23% | -39.74% | 0.61 | 36.84% | 19 |
| 20 | 50 | 154.46% | 12.88% | -41.80% | 0.59 | 50.00% | 20 |
| 10 | 60 | 143.12% | 12.22% | -42.96% | 0.58 | 34.78% | 23 |
| 5 | 50 | 120.67% | 10.82% | -38.67% | 0.53 | 36.67% | 30 |
| 5 | 30 | 114.61% | 10.42% | -43.44% | 0.51 | 33.33% | 42 |
| 5 | 60 | 112.66% | 10.29% | -44.17% | 0.51 | 33.33% | 30 |
| 10 | 50 | 110.51% | 10.14% | -45.11% | 0.51 | 40.00% | 25 |
| 20 | 60 | 105.44% | 9.79% | -45.12% | 0.49 | 52.63% | 19 |
| 5 | 40 | 100.89% | 9.47% | -43.79% | 0.48 | 33.33% | 33 |
| 10 | 30 | 52.47% | 5.63% | -46.88% | 0.34 | 31.43% | 35 |
| 15 | 30 | 48.69% | 5.28% | -53.65% | 0.32 | 37.14% | 35 |
| 20 | 40 | 39.92% | 4.46% | -54.05% | 0.30 | 40.00% | 25 |
| **5** | **20** | **30.20%** | **3.48%** | **-49.64%** | **0.26** | **26.56%** | **64** |
| 15 | 40 | 22.18% | 2.63% | -61.75% | 0.23 | 30.77% | 26 |
| 10 | 20 | 20.57% | 2.46% | -58.71% | 0.22 | 29.82% | 57 |
| 10 | 40 | 18.41% | 2.22% | -55.93% | 0.21 | 32.14% | 28 |
| 15 | 20 | 14.52% | 1.78% | -55.48% | 0.20 | 36.92% | 65 |
| 20 | 30 | -7.69% | -1.03% | -57.52% | 0.10 | 30.00% | 40 |

扫描区间：最高 **+195.67%**（快15/慢50），最低 **-7.69%**（快20/慢30）。

::: warning 这就是过拟合最直观的样子
你在表格里挑一个"最好看"的参数发朋友圈，和抛硬币没区别——因为它只是**在这 8 年这段历史**上恰好最优。换一段时间、换一只票，最优参数立刻变。真正的检验是**样本外**：用 2018-2022 调参、2023-2025 验证，看最优参数在新区间还灵不灵。下面马上做。
:::

## 样本外验证：冠军参数为何"看起来很美"

> 上面整段参数表最危险的地方：你总会忍不住挑收益最高的那个（快15/慢50，全周期 +195.67%）发朋友圈。但它只是**在这 8 年这段历史**上恰好最优。换一段时间它还灵不灵？这一步就把"样本外"做实。

做法（最朴素的 train / test split）：
1. 用 **2018-2022**（5 年）做样本内（in-sample）调参，找出收益最高的"冠军参数"
2. 把这组参数**原封不动**拿到 **2023-2025**（3 年）做样本外（out-of-sample）验证
3. 对照：冠军参数 vs 默认参数(快5/慢20) vs 买入持有，在样本外的表现
4. 再算"样本外也作弊挑最优"（上界），看冠军离上界多远、排第几

> 注：上面整段参数表是 **2018-2025 全周期**的扫描；这里切出 2018-2022 做样本内，所以冠军收益是 +243.25%，比全周期 +195.67% 更高——因为 2023 之后是下行段，把全周期拉低了。两段用的是同一份真实数据，只是切法不同。

真实数据（茅台前复权）：样本内 2018-01-02~2022-12-30（1215 根）｜样本外 2023-01-03~2025-12-31（727 根）。

样本内冠军：**快15/慢50**，收益 **+243.25%**，夏普 0.99，仅 14 次交易（慢线 → 少折腾）。

| 方案 | 样本内收益 | 样本外收益 | 样本外排名(共19组) | 跑赢持有? |
| --- | --- | --- | --- | --- |
| 样本内冠军(快15/慢50) | +243.25% | -14.86% | 2 | 否 |
| 默认(快5/慢20) | +130.82% | -45.80% | 17 | 否 |
| 样本外作弊最优(快15/慢60) | — | -14.37% | 1 | 否 |
| 买入持有(样本外) | — | -12.99% | — | — |

> 样本外买入持有为 -12.99%（2023-2025 茅台处于高位回落的震荡下行市）。冠军参数从样本内 +243% 衰减到样本外 -14.86%，差了约 258 个百分点。

**样本外净值曲线**（冠军 vs 默认 vs 买入持有，2023-2025，可拖拽缩放）：

```echarts
{oos_json}
```

::: warning 读这张表的三个反直觉
1. **冠军没崩，但也没赢**：样本内冠军到了样本外排第 2/19，没有过拟合到"最差"，但也没跑赢买入持有（-14.86% vs -12.99%）。因为这几年是下行市，谁都难赚——样本外验证的价值是看**参数稳健性**，不是证明策略能赚钱。
2. **第一步的"主角"默认参数最脆弱**：快5/慢20 在样本外排 17/19（-45.80%），被反复假突破打脸。它能在第一步"看起来还行"（+30%），纯是因为吃到了 2018-2022 的牛市；换个 regime 立刻失灵。这正应了上面"参数敏感性 = 过拟合风险"。
3. **方向比数字稳**：样本内冠军（慢线50）和样本外最优（慢线60）都是"慢 + 少交易"，几乎同收益；而快线最惨。说明"趋势策略用慢线、少折腾"这个**方向**比"具体某个快慢数字"更经得起样本外。
:::

::: tip 给你的实操清单
- 任何参数，先在样本内选出 Top-N（不要只信第 1），再看它们在样本外的稳定性
- 样本外必须**用没参与调参的数据**，且参数一旦选定就冻结，不能再改
- 把"样本外跑赢基准"当成上桌门槛；跑不赢，策略连基准都不如，不如买指数
- 单只票的样本外还不够，至少换 3~5 只不同行业的票做同样检验（跨标的样本外），才敢说"不是巧合"——下面马上做
:::

## 多标的验证：双均线是不是只茅台灵

上一篇用茅台跑出「+30% vs 买入持有 +222%」，结论很扎心：双均线大幅跑输。但一个挥之不去的怀疑是——**这是茅台的巧合，还是双均线的通病？**

验证方法很笨也很直接：把上面**完全没改**的双均线(快5/慢20)框架，原封不动套到一篮子 A 股上，看「跑输买入持有」是不是普遍现象。如果一篮子蓝筹里大部分都跑输，那就不是茅台的锅。

### 数据口径（和前文完全一致）

- 数据源：akshare 前复权日线，2018-01-02 ~ 2025-12-31
- 成本：佣金万3 双边 + 印花税万5 卖出 + 滑点0.1% 单边
- 成交：次日收盘（T+1 近似，避未来函数）
- 取了 5 只代表性标的：贵州茅台、招商银行、五粮液、宁德时代、中国平安

::: warning 真实数据的脏数据陷阱
宁德时代(300750) 的前复权序列第一根价居然是 **-2.09 元（负值）**——akshare 对高送转次新股的前复权有已知 bug，负价会让 `(1+日收益).cumprod()` 直接崩成 -17274% 这种离谱数。**遇到脏数据必须剔除，而不是让它污染结论。** 本篇把宁德时代剔除，剩 4 只干净数据。（这也提醒：回测里「数据对不对」比「策略牛不牛」更要命。）
:::

### 四只标的横向对比

| 标的 | 双均线总收益 | 买入持有 | 胜负 | 夏普 | 最大回撤 | 交易次数 | 样本外(23-25) |
| --- | --- | --- | --- | --- | --- | --- | --- |
{table_rows}
> 样本外 = 把 2023-01-01 之后的数据单独再跑一次双均线，看「训练期牛市里有效」的策略在新区间是否还灵。

### 多标的净值曲线（双均线策略，各标的归一化到首日=1）

```echarts
{beyond_nav_json}
```

::: warning 三个反直觉结论
1. **双均线(5/20)在这 4 只蓝筹上，全周期全部跑输买入持有。** 不是茅台巧合，是通病。根因很朴素：双均线是「吃趋势」的择时策略，牛市里它频繁在假突破上进出、还白白交手续费，而买入持有吃满了完整涨幅。
2. **样本外(2023-2025 震荡下行市)出现分化**：招商银行(+7.65%)、中国平安(+19.75%) 双均线小幅为正，茅台(-45.80%)、五粮液(-35.43%) 大亏。说明双均线在**低波动、区间震荡**的票上更抗跌，在**高波动、趋势反转**的票上被反复打脸——它本质赚的是「单边趋势」的钱。
3. **夏普全都很低（0.04~0.36，平安甚至为负）**。即使得意时收益也不够「风险调整后」的看头，进一步说明双均线作为长期择时工具，性价比堪忧。
:::

> 多标的验证的复现脚本在 `docs/code/quant/beyond_dual_ma.py` + `docs/code/quant/get_multi_data.py`（数据缓存见 `docs/code/quant/*_qfq.csv`）。

## 你能带走的认知

1. **双均线是趋势策略**，只在有趋势时赚钱；震荡市/单边市会被来回打脸
2. **成本不是小事**：64 次交易，每次摩擦 0.1%~0.2%，累积吃掉几十个点
3. **跑赢基准才是硬道理**：任何策略首先该和"买入持有"比，而不是看绝对收益
4. **参数敏感性 = 过拟合风险**：扫描区间收益跨度越大，越要警惕
5. **跨标的样本外才敢说"不是巧合"**：单只票的结论，换 4 只蓝筹依然偏负，通病坐实
6. **引擎自己写一遍，理解深一倍**

## 完整代码

回测脚本在 `docs/code/quant/dual_ma_backtest.py`，纯 pandas 实现，从 `docs/code/quant/` 目录运行 `python dual_ma_backtest.py` 复现（需 `pip install pandas numpy matplotlib akshare`）。核心回测函数：

```python
def backtest(close, fast, slow):
    ma_fast = close.rolling(fast).mean()
    ma_slow = close.rolling(slow).mean()
    signal = (ma_fast > ma_slow).astype(float)   # 1=持仓 0=空仓
    position = signal.shift(1).fillna(0.0)        # 次日收盘成交，避开未来函数
    ret = close.pct_change().fillna(0.0)
    strat_ret = position * ret
    change = position.diff().fillna(position.iloc[0])
    cost = change.abs() * (COMMISSION*2 + STAMP + SLIPPAGE*2)  # 真实交易成本
    strat_ret_net = strat_ret - cost
    equity = (1 + strat_ret_net).cumprod()        # 净值曲线
    return equity
```

> 数据获取、参数扫描、指标计算见完整脚本。本文所有数字（含多标的验证）均由脚本在真实数据上跑出，非编造。

## 下一步

本文把双均线从「单标的」验证到「多标的」，结论一致偏负。但双均线只是最基础的「零件」，后续可独立成篇：

- **多策略横评**：双均线 vs 均线+动量 vs 布林带/海龟，同一框架下同台比，看哪种零件在真实数据上更经得起样本外（换策略才新开，独立测评文）
- **评估层更厚**：最大回撤/卡玛/索提诺补全、滚动 walk-forward、参数高原 vs 孤岛
"""


with open(os.path.join(ARTICLE_DIR, "README.md"), "w", encoding="utf-8") as f:
    f.write(md)
print("README.md 已生成，", len(md), "字符")
