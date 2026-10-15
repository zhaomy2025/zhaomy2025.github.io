"""生成组合构建笔记 README.md：把 portfolio_build.json 的数据内嵌为 echarts，避免手贴大段 JSON。"""
import os
import json

HERE = os.path.dirname(os.path.abspath(__file__))
ARTICLE_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "quant", "portfolio"))

data = json.load(open(os.path.join(ARTICLE_DIR, "portfolio_build.json"), encoding="utf-8"))
dates = data["dates"]
portfolios = data["portfolios"]
full = {r["name"]: r for r in data["table"]["full"]}
oos = {r["name"]: r for r in data["table"]["oos"]}
strat = {r["name"]: r for r in data["table"]["strat"]}
corr = data["corr"]
stats = data["stats"]

ORDER = ["买入持有·等权4标的", "双均线×4标的等权", "等权16腿", "风险平价16腿", "波动率目标16腿"]
STRAT_ORDER = ["双均线(5/20)×4标的", "均线+动量×4标的", "布林带(20,2σ)×4标的", "海龟(20/10)×4标的"]


def pct(x):
    return f"{x*100:+.2f}%"


def volp(x):
    """波动率正文用：不带强制 + 号。"""
    return f"{x*100:.2f}%"


def row_html(r, extra=None):
    return (f"| {r['name']} | {pct(r['total_return'])} | {pct(r['annual_return'])} | "
            f"{pct(r['max_drawdown'])} | {r['sharpe']:.2f} | {pct(r['volatility'])} |")


def table_block(title, table, order, note=None):
    lines = [
        f"### {title}",
        "| 组合 | 总收益 | 年化 | 最大回撤 | 夏普 | 年化波动 |",
        "| --- | ---: | ---: | ---: | ---: | ---: |",
    ]
    for name in order:
        if name in table:
            lines.append(row_html(table[name]))
    if note:
        lines.append("")
        lines.append(f"> {note}")
    return "\n".join(lines)


# ---- echarts 1：组合净值对比 ----
P_KEYS = ["bh_equal", "dual_ma_avg", "eq16", "rp16", "vt16"]
series = [{
    "name": portfolios[k]["name"], "type": "line", "showSymbol": False,
    "data": portfolios[k]["equity"],
    "lineStyle": {"width": 2.0 if k in ("bh_equal", "eq16") else 1.5, "color": portfolios[k]["color"]},
    "itemStyle": {"color": portfolios[k]["color"]},
} for k in P_KEYS]

nav_json = json.dumps({
    "tooltip": {"trigger": "axis"},
    "legend": {"data": [portfolios[k]["name"] for k in P_KEYS]},
    "grid": {"left": 50, "right": 20, "top": 55, "bottom": 70},
    "xAxis": {"type": "category", "data": dates, "boundaryGap": False},
    "yAxis": {"type": "value", "name": "净值(起点=1)", "scale": True},
    "dataZoom": [{"type": "inside"}, {"type": "slider"}],
    "series": series,
}, ensure_ascii=False)

# ---- echarts 2：策略层相关性热图 ----
# md-enhance 的 echarts 块用 JSON.parse 解析，不支持 JS 函数；
# 因此把数值放进数据项 name，label/tooltip 用字符串模板 {b} 取 name
s_names = corr["strategies"]
heat_data = []
for i, r in enumerate(corr["matrix"]):
    for j, v in enumerate(r):
        heat_data.append({"name": f"{v:.3f}", "value": [j, i, v]})
heat_json = json.dumps({
    "tooltip": {"formatter": "相关度：{b}"},
    "grid": {"left": 95, "right": 30, "top": 10, "bottom": 55},
    "xAxis": {"type": "category", "data": s_names, "axisLabel": {"rotate": 25}},
    "yAxis": {"type": "category", "data": s_names},
    "visualMap": {
        "min": 0, "max": 1, "orient": "horizontal", "left": "center", "bottom": 0,
        "calculable": True, "text": ["低相关", "高相关"],
        "inRange": {"color": ["#34d399", "#f1f5f9", "#ef4444"]},
    },
    "series": [{
        "type": "heatmap", "data": heat_data,
        "label": {"show": True, "formatter": "{b}", "fontSize": 12},
        "itemStyle": {"borderColor": "#fff", "borderWidth": 2},
    }],
}, ensure_ascii=False)

f_bh = full["买入持有·等权4标的"]
f_eq = full["等权16腿"]
f_rp = full["风险平价16腿"]
f_vt = full["波动率目标16腿"]
f_dm = full["双均线×4标的等权"]
o_bh = oos["买入持有·等权4标的"]
o_eq = oos["等权16腿"]
o_rp = oos["风险平价16腿"]
o_vt = oos["波动率目标16腿"]

# 关键叙事数字（从 JSON 动态取，保证与表格一致）
bh_ret, bh_vol, bh_mdd = pct(f_bh["total_return"]), volp(f_bh["volatility"]), pct(f_bh["max_drawdown"])
eq_ret, eq_vol, eq_mdd, eq_sharpe = pct(f_eq["total_return"]), volp(f_eq["volatility"]), pct(f_eq["max_drawdown"]), f_eq["sharpe"]
dm_ret = pct(f_dm["total_return"])
rp_ret, rp_mdd, rp_vol = pct(f_rp["total_return"]), pct(f_rp["max_drawdown"]), volp(f_rp["volatility"])
vt_ret, vt_sharpe, vt_vol = pct(f_vt["total_return"]), f_vt["sharpe"], volp(f_vt["volatility"])
o_eq_ret, o_eq_mdd = pct(o_eq["total_return"]), pct(o_eq["max_drawdown"])
o_rp_ret, o_rp_mdd = pct(o_rp["total_return"]), pct(o_rp["max_drawdown"])
o_vt_ret, o_vt_sharpe = pct(o_vt["total_return"]), o_vt["sharpe"]
o_bh_ret, o_bh_mdd = pct(o_bh["total_return"]), pct(o_bh["max_drawdown"])
avg_leg_vol = volp(stats["avg_leg_vol"])

c_boll = corr["matrix"][2]
c_boll_avg = (c_boll[0] + c_boll[1] + c_boll[3]) / 3
c_trend_avg = (corr["matrix"][0][1] + corr["matrix"][0][3] + corr["matrix"][1][3]) / 3

md = f"""---
title: 组合构建
date: 2026-09-10
category: quant
tags: [量化, 组合构建, 风险平价, 波动率目标, 分散化]
---

# 组合构建：把 4 策略 × 4 标的合成一个组合

[[toc]]

前两篇把两件事钉死了：双均线跑输买入持有是通病（4 只蓝筹全输）；换策略也救不回来（横评里没有一个策略全周期跑赢持有）。那自然要问：**单腿不行，把它们合成一个组合呢？分散化能不能把"输"变成"赢"？**

这篇文章不再挑"更好的策略"，而是把前文的 4 策略 × 4 标的（共 16 条腿）合成组合，比三种可实盘的组合做法：**等权、风险平价、波动率目标**。数据仍是本地落盘的真实前复权日线（2018-2025，4 只标的各 1942 根），成本假设与前文完全一致（佣金万3、印花税万5、滑点0.1%、T+1 次日成交）。

::: warning 先说结论
**组合治波动，不治收益。** 等权 16 腿把年化波动从买入持有的 {bh_vol} 砍到 {eq_vol}（分散化收益比 {stats['diversification_ratio']:.2f}）、回撤从 {bh_mdd} 减到 {eq_mdd}，但全周期 {eq_ret} 依然大幅跑输买入持有等权 {bh_ret}。组合的第一课不是"把多个烂策略拼成一个好策略"，而是**用分散化控制你输得有多痛**。
:::

## 为什么单腿不行，组合还要做

前两篇的结论是"择时策略没有 edge"——但那只证明"单押一个策略、一只票"不是好主意。组合的问题是另一件事：

1. **分散化的数学**：组合波动 ≤ 各腿加权平均波动，相关性 < 1 时严格更小。哪怕每条腿都平庸，相关性低就能让组合"更稳"。
2. **从选策略到配权重**：不再赌"哪个策略对"，而是赌"哪些腿之间的相关性低"。
3. **16 条腿怎么来的**：4 策略（双均线/均线+动量/布林带/海龟）× 4 标的（茅台/招行/五粮液/平安），每条腿复用前文的 position 逻辑与真实成本，日净收益直接合成。

## 三个组合做法（全部可实盘，无未来函数）

| 组合 | 做法 | 一句话 |
| --- | --- | --- |
| 等权 16 腿 | 每条腿 1/16，日度再平衡（组合日收益 = 16 腿日收益均值） | 最朴素，没有任何预测 |
| 风险平价 | 权重 ∝ 1/σᵢ，σᵢ = 60 日滚动年化波动，当日算、次日生效 | 让每条腿贡献相同的风险 |
| 波动率目标 | 等权 16 腿按 15% 年化目标波动缩放（60 日滚动、次日生效、杠杆 ≤2×） | 波动放大就减仓，风平浪静才上杠杆 |
| 买入持有·等权 4 标的 | 4 只股票等权长期持有 | 组合层面的基准 |

> 风险平价和波动率目标都只用"当天为止"的信息估计波动、次日生效，模拟盘可以直接照抄；滚动窗口（60 日）、目标波动（15%）、杠杆上限（2×）本身也是参数，同样有选择空间（见文末交代）。

## 全周期结果（2018-2025）

{table_block("全周期（2018-2025）", full, ORDER)}

```echarts
{nav_json}
```

三条腿的"组合效应"一眼可见：

- **波动减半**：16 腿平均年化波动 {avg_leg_vol}，等权 16 腿只有 {eq_vol}——分散化收益比 {stats['diversification_ratio']:.2f}，意思是"同样权重下，组合波动只有各腿平均波动的 1/{stats['diversification_ratio']:.2f}"。
- **回撤减半**：从买入持有的 {bh_mdd} → 等权 16 腿的 {eq_mdd}。
- **收益没变出来**：等权 16 腿 {eq_ret}，还是输给基准 {bh_ret}。分散化只压缩波动，不产生 alpha。

## 中间层：单策略 × 4 标的等权

先看"同一策略横跨 4 只票"的等权组合（这是 16 腿组合的一半）：

{table_block("单策略×4标的等权（全周期）", strat, STRAT_ORDER)}

有意思的地方：**布林带单标的全周期只有 +21.52%（四策略垫底），但"布林带×4标的等权"也只有 +1.19%，而均线+动量×4 与海龟×4 都有 +32% 左右**。策略收益的来源高度依赖市况（横评结论），但组合把这种"依赖"抹平了一部分——代价是收益也被抹平。

## 相关性矩阵：组合里真正的"分散化来源"

```echarts
{heat_json}
```

- **三个趋势策略互相 0.91~0.92**（双均线/均线+动量/海龟）。它们在逻辑上都是"吃单边趋势"，换参数、换姿势，本质是同一派——把三个高度相关的策略放一起，分散化收益约等于零。
- **布林带与三者只有 0.05~0.11**。均值回复和趋势跟随几乎正交，16 条腿里唯一真正的独立自由度是"**趋势 vs 反转**"这一条轴。
- 16 腿平均绝对相关系数只有 {stats['avg_abs_corr']:.3f}——相关性低主要靠布林带（均值回复）贡献，其次是标的之间的差异。

> 结论：**组合的价值取决于腿之间的独立性，不是腿的数量。** 4 个策略里真正独立的只有 2 派，16 条腿的"有效自由度"远比 16 小。

## 样本外（2023-2025）

{table_block("样本外（2023-2025）", oos, ORDER)}

样本外是震荡下行市（买入持有等权 {o_bh_ret}）。三个组合的表现分化很明显：

- **等权 16 腿 {o_eq_ret}**：仍然没赢基准，但回撤 {o_eq_mdd} vs 基准 {o_bh_mdd}——跌的时候痛感减半。
- **风险平价 {o_rp_ret}、回撤 {o_rp_mdd} 全场最小**：它把权重压向低波动腿（布林带、平安这类），天然"最不亏"，代价是牛市也不怎么赚。
- **波动率目标 {o_vt_ret}，样本外唯一正收益、夏普 {o_vt_sharpe:.2f} 最高**：波动率缩放 = 波动放大就减仓，震荡下行市里自动躲掉大跌。

## 四个反直觉结论

1. **组合治波动，不治收益。** 等权 16 腿把波动和回撤各砍一半，但 {eq_ret} vs 持有 {bh_ret}——择时策略的收益缺口是"策略没 edge"造成的，分散化补不上这个洞。上两篇的结论在组合层面依然成立。
2. **相关性说真话。** 三个"不同"的趋势策略相关 0.91+，布林带才是唯一的独立自由度。**组合设计先看相关性矩阵，别数腿的数量**——16 条腿里真正独立的逻辑只有"趋势 vs 反转"两派。
3. **风险平价不是免费的午餐。** 全周期 {rp_ret} 垫底：它把权重压向低波动腿，牛市里这些腿吃不到趋势；但样本外回撤 {o_rp_mdd} 全场最小。它买的是"波动预算均等"，不是收益。
4. **波动率目标在样本外唯一赚钱（{o_vt_ret}）。** 自动波动率缩放是"追涨杀跌"的反面——波动放大就减仓。但它牛市也会降杠杆（全周期只有 {vt_ret}），本质是拿牛市收益换尾部保护。

::: tip 一个老实的交代
- 风险平价/波动率目标的权重用的是 60 日滚动波动估计、当日算次日生效，没有未来函数；但 **60 日窗口、15% 目标、2× 杠杆上限这些参数本身是拍脑袋选的**，同样有过拟合空间，需要 walk-forward 检验。
- 日度再平衡的等权组合含有"再平衡收益"（波动率收割），不等于"各买一次放着"。
- 样本外仍然只切了 2023-2025 一段；更稳的结论等滚动 walk-forward（多段样本外）再做。
:::

## 你能带走的认知

- 组合的第一课：**分散化控制"输得有多痛"，不保证"赢"**——先看回撤和波动，再看收益。
- 组合设计先看相关性：**独立逻辑 > 腿的数量**，高度相关的策略堆再多也是同一条腿。
- 风险平价/波动率目标是**风险预算工具**，不是收益增强工具；它们的作用在样本外的回撤上看得最清楚。
- 组合层面也要有基准：永远和"买入持有等权"比，而不是和"单个策略"比。

## 完整代码

回测脚本在 `docs/code/quant/portfolio_build.py`，复用 `strategy_zoo.py` 的四个策略 position 函数与 `dual_ma_backtest.py` 的真实成本假设。核心逻辑：先把 16 条腿收敛成日净收益面板（`leg_net_ret`），再分别做等权（`mean`）、风险平价（`1/σ` 加权）、波动率目标（`target/σ` 缩放），指标口径与前文完全一致。

## 下一步

组合有了，但"组合为什么是现在的收益"还不清楚。下一篇做**绩效归因**：用 Brinson 归因把组合收益拆成配置收益、选股收益、交互收益，回答"这笔钱到底是靠分散化赚的，还是靠恰好重仓了茅台赚的"——这是评估层的最后一块拼图，接上你最初"评估层要自己写"的规划。
"""

with open(os.path.join(ARTICLE_DIR, "README.md"), "w", encoding="utf-8") as f:
    f.write(md)
print(f"[done] README.md ({len(md)} chars) -> {os.path.join(ARTICLE_DIR, 'README.md')}")
