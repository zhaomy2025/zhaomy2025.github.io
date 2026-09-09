"""生成多策略横评笔记 README.md：把对比数据内嵌为 echarts，避免手贴大段 JSON。"""
import os
import json

HERE = os.path.dirname(os.path.abspath(__file__))
ARTICLE_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "quant", "strategy-zoo"))

data = json.load(open(os.path.join(ARTICLE_DIR, "strategy_zoo.json"), encoding="utf-8"))
dates = data["dates"]
buyhold = data["buyhold"]
strats = data["strategies"]
full = {r["name"]: r for r in data["table"]["full"]}
oos = {r["name"]: r for r in data["table"]["oos"]}

ORDER = ["双均线(5/20)", "均线+动量", "布林带(20,2σ)", "海龟(20/10)"]


def pct(x):
    return f"{x*100:+.2f}%"


def row_html(r):
    return (f"| {r['name']} | {pct(r['total_return'])} | {pct(r['annual_return'])} | "
            f"{pct(r['max_drawdown'])} | {r['sharpe']:.2f} | {r['n_trades']} | "
            f"{pct(r['win_rate'])} | {pct(r['buyhold_return'])} |")


def table_block(title, table):
    lines = [
        f"### {title}",
        "| 策略 | 总收益 | 年化 | 最大回撤 | 夏普 | 交易次数 | 胜率 | 同期买入持有 |",
        "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    for name in ORDER:
        if name in table:
            lines.append(row_html(table[name]))
    return "\n".join(lines)


# echarts 多策略净值图
KEYS = ["dual_ma", "ma_mom", "boll", "turtle"]
series = [{
    "name": "买入持有", "type": "line", "showSymbol": False,
    "data": buyhold,
    "lineStyle": {"width": 2, "color": "#9ca3af"}, "itemStyle": {"color": "#9ca3af"},
}]
for key in KEYS:
    s = strats[key]
    series.append({
        "name": s["name"], "type": "line", "showSymbol": False,
        "data": s["equity"],
        "lineStyle": {"width": 1.5, "color": s["color"]}, "itemStyle": {"color": s["color"]},
    })

nav_json = json.dumps({
    "tooltip": {"trigger": "axis"},
    "legend": {"data": ["买入持有"] + [strats[k]["name"] for k in KEYS]},
    "grid": {"left": 50, "right": 20, "top": 50, "bottom": 70},
    "xAxis": {"type": "category", "data": dates, "boundaryGap": False},
    "yAxis": {"type": "value", "name": "净值(起点=1)", "scale": True},
    "dataZoom": [{"type": "inside"}, {"type": "slider"}],
    "series": series,
}, ensure_ascii=False)

md = f"""---
title: 多策略横评
date: 2026-09-03
category: quant
tags: [量化, 回测, 策略横评, 双均线, 布林带, 海龟]
---

# 多策略横评：同一只茅台上，双均线 / 均线+动量 / 布林带 / 海龟谁更稳

[[toc]]

前文把「双均线跑输买入持有」钉成了通病——而且是在一篮子蓝筹上都成立。那自然要问：**是不是换个策略就能赢？**

这篇文章不拍脑袋，把四个常见策略摆在同一只票、同一套真实成本假设下硬比：双均线（基准）、均线+动量（双均线的降噪版）、布林带（均值回复）、海龟（突破跟随）。数据仍是贵州茅台前复权真实日线（2018-2025，1942 根），成本假设与前文完全一致（佣金万3、印花税万5、滑点0.1%、T+1 次日成交、长仓 only）。

::: warning 先说结论
**没有常胜将军。** 全周期最好看的策略，样本外往往不是它；全周期最弱的策略，样本外反而可能一枝独秀。横评的价值不是"选出赢家"，而是让你看见「策略表现高度依赖市况」这件事。
:::

## 四个策略一句话

| 策略 | 一句话逻辑 | 思路 |
| --- | --- | --- |
| 双均线(5/20) | 快线上穿慢线持仓，下穿空仓 | 趋势跟随（基准） |
| 均线+动量 | 金叉 **且** 60 日动量>0 才持仓 | 趋势跟随 + 降噪 |
| 布林带(20,2σ) | 价格下穿下轨买、上穿中轨卖 | 均值回复 |
| 海龟(20/10) | 创 20 日新高买、破 10 日新低卖 | 突破跟随（唐奇安通道） |

所有策略共用 `dual_ma_backtest` 的成本假设，保证对比公平——同样的手续费、同样的 T+1、同样长仓。回测脚本在同目录 `strategy_zoo.py`，可直接 `python strategy_zoo.py` 复现（需 `pip install pandas numpy`）。

## 全周期对比（2018-2025）

{table_block("全周期（2018-2025）", full)}

```echarts
{nav_json}
```

## 样本外对比（2023-2025）

前文强调过：参数/策略"在已知历史上好看"不算数，得看没见过的区间。下面用 2023-01-01 之后（茅台震荡下行段）独立回测，参数照旧、数据全新：

{table_block("样本外（2023-2025）", oos)}

## 三个反直觉结论

1. **全周期冠军，样本外摔得最惨之一。** 海龟全周期总收益 +56.28%、夏普 0.36 都是四者最高，但样本外 -32.47%，比双均线（-45.80%）好不了多少。它的"好看"主要靠 2018-2022 那轮牛市，换震荡市立刻露馅。
2. **全周期最弱，样本外唯一赚钱。** 布林带全周期只 +21.52%（四者垫底），但样本外 **+14.21%**、夏普 0.44、回撤仅 -10.89%、胜率 76.92%——是唯一在下行市正收益的策略。均值回复在"跌多了弹一下"的震荡市天然占便宜。
3. **四者全周期都跑输买入持有（+221.96%）。** 这和前文结论一致：择时策略吃的是趋势段，但 A 股长牛段（茅台 18-21）持有吃满，择时反而因频繁进出 + 白交手续费落后。横评没有推翻"双均线通病"，只是补充了"**不同市况下不同策略各有优劣**"。

::: tip 一个老实的交代
样本外只切了一段（2023-2025），且只在茅台一只票上。要更稳的结论，得做滚动 walk-forward（多段样本外）+ 多标的。这里只是把"换策略能赢吗"这个问题，从拍脑袋变成"看数据说话"的第一步。
:::

## 你能带走的认知

- 策略没有"更好"，只有"更适合当前市况"。横评的意义是建立这个直觉，而不是选出一个永远对的策略。
- 看策略不能只看全周期收益——**样本外 + 回撤 + 胜率 + 交易次数**一起看，才能判断它是真有 edge 还是恰好贴合某段历史。
- 真实成本假设是横评的前提：没有统一成本，对比毫无意义。

## 完整代码

回测脚本在同目录 `docs/code/quant/strategy_zoo.py`，复用 `dual_ma_backtest` 的真实成本逻辑。核心是把每个策略收敛成一条 `position`（0/1）序列，再用统一函数算净值与指标——**策略差异只在"怎么生成 position"，成本与统计完全共享**。

## 下一步

量化笔记到目前为止都是"脚本 + 文章"。你最初的目标其实是「**开发一个用模拟数据跑通的量化应用**」——下一步可以把它做成一个可交互的回测应用（选策略、选标的、看净值曲线），前端轻量、后端 FastAPI，正好接上你现有的回测函数。
"""

with open(os.path.join(ARTICLE_DIR, "README.md"), "w", encoding="utf-8") as f:
    f.write(md)
print(f"[done] README.md ({len(md)} chars) -> {os.path.join(ARTICLE_DIR, 'README.md')}")
