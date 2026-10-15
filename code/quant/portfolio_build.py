"""
组合构建回测（纯 pandas，A 股真实日线）
=========================================
把前文攒下的 4 策略 × 4 标的（共 16 条腿）合成组合，回答：
  单腿都跑输买入持有，组合能翻盘吗？组合的第一课是分散化还是选策略？

组合做法（全部可实盘、无未来函数）：
  1. 等权 16 腿     —— 每条腿 1/16 权重，日度再平衡（组合日收益 = 16 腿日收益均值）
  2. 风险平价       —— 权重 ∝ 1/σᵢ，σᵢ 用 60 日滚动真实波动率估计，当日算、次日生效
  3. 波动率目标     —— 等权 16 腿组合按 15% 目标年化波动缩放（60 日滚动，次日生效，杠杆上限 2×）
  对照基准：4 标的等权买入持有（组合层面第一次真正意义的"基准"）

复用：
  - strategy_zoo.py 的四个策略 position 函数（双均线/均线+动量/布林带/海龟）
  - dual_ma_backtest.py 的真实成本假设（佣金万3 + 印花税万5 + 滑点0.1% + T+1 次日成交）

数据：本地落盘真实数据 *_qfq.csv（前复权日线 2018-2025，4 只标的共 1942 根）。
输出：docs/quant/portfolio/portfolio_build.json（净值 + 全周期/样本外对比表 + 策略相关性矩阵），
     供 build_portfolio_note.py 生成文章。
"""

import os
import sys
import json
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
ARTICLE_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "quant", "portfolio"))

from strategy_zoo import pos_dual_ma, pos_ma_momentum, pos_bollinger, pos_turtle  # noqa: E402
from dual_ma_backtest import COMMISSION, STAMP, SLIPPAGE  # noqa: E402

# ---------------- 数据与策略定义 ----------------

SYMBOLS = {
    "600519": "贵州茅台",
    "600036": "招商银行",
    "000858": "五粮液",
    "601318": "中国平安",
}

STRATS = [
    ("dual_ma", "双均线(5/20)", pos_dual_ma),
    ("ma_mom", "均线+动量", pos_ma_momentum),
    ("boll", "布林带(20,2σ)", pos_bollinger),
    ("turtle", "海龟(20/10)", pos_turtle),
]

OOS_START = pd.Timestamp("2023-01-01")
VOL_WINDOW = 60          # 滚动波动率估计窗口（交易日）
VOL_MINP = 20            # 最少观测
TARGET_VOL = 0.15        # 波动率目标：15% 年化
MAX_LEVERAGE = 2.0       # 波动率目标缩放上限


def load(sym: str):
    p = os.path.join(HERE, f"{sym}_qfq.csv")
    df = pd.read_csv(p, parse_dates=["date"]).sort_values("date").reset_index(drop=True)
    bad = (df["close"] <= 0) | df["close"].isna()
    if bad.any():
        raise ValueError(f"{sym} 含负价/缺失，前复权异常，剔除")
    return df


def leg_net_ret(position: pd.Series, close: pd.Series) -> pd.Series:
    """单条腿的日净收益：持仓收益 - 交易成本（与 strategy_zoo.run_strategy 完全一致）。"""
    position = position.astype(float)
    ret = close.pct_change().fillna(0.0)
    strat_ret = position * ret
    change = position.diff().fillna(position.iloc[0])
    cost = change.abs() * (COMMISSION * 2 + STAMP + SLIPPAGE * 2)
    net = strat_ret - cost
    if position.iloc[0] > 0:
        net.iloc[0] -= COMMISSION + SLIPPAGE
    return net


def metrics(ret: pd.Series) -> dict:
    """与 dual_ma_backtest 同一套指标口径。"""
    eq = (1 + ret).cumprod()
    peak = eq.cummax()
    mdd = ((eq - peak) / peak).min()
    years = len(ret) / 252
    total = eq.iloc[-1] - 1
    ann = eq.iloc[-1] ** (1 / years) - 1 if years > 0 else 0.0
    vol = ret.std() * np.sqrt(252)
    sharpe = (ret.mean() * 252) / (vol + 1e-9)
    return {
        "total_return": float(total),
        "annual_return": float(ann),
        "max_drawdown": float(mdd),
        "sharpe": float(sharpe),
        "volatility": float(vol),
    }


def risk_parity_ret(legs: pd.DataFrame) -> pd.Series:
    """风险平价：权重 ∝ 1/σᵢ（60 日滚动年化波动），当日算、次日生效。热身期等权。"""
    n = legs.shape[1]
    vol = legs.rolling(VOL_WINDOW, min_periods=VOL_MINP).std() * np.sqrt(252)
    inv = 1.0 / vol
    w = inv.div(inv.sum(axis=1), axis=0)
    warm = vol.isna().any(axis=1)
    w.loc[warm] = 1.0 / n
    return (w.shift(1) * legs).sum(axis=1).fillna(0.0)


def vol_target_ret(legs: pd.DataFrame) -> pd.Series:
    """波动率目标：等权 16 腿组合按 15% 年化目标缩放（60 日滚动，次日生效，杠杆≤2）。"""
    eq = legs.mean(axis=1)
    vol = eq.rolling(VOL_WINDOW, min_periods=VOL_MINP).std() * np.sqrt(252)
    scale = TARGET_VOL / vol
    scale = scale.clip(upper=MAX_LEVERAGE)
    scale[vol.isna()] = 1.0
    return (scale.shift(1) * eq).fillna(0.0)


def main():
    # 1) 加载 4 只标的并核对日期对齐
    frames = {}
    for sym, name in SYMBOLS.items():
        df = load(sym)
        frames[sym] = df
        print(f"[data] {name}({sym}) {df['date'].min().date()}~{df['date'].max().date()} {len(df)} 根")
    base_dates = frames["600519"]["date"].reset_index(drop=True)
    for sym, df in frames.items():
        assert (df["date"].reset_index(drop=True) == base_dates).all(), f"{sym} 日期未对齐"

    # 2) 构建 16 条腿的日净收益面板（列 = 策略·标的）
    legs = {}
    for skey, sname, fn in STRATS:
        for sym, name in SYMBOLS.items():
            close = frames[sym]["close"].reset_index(drop=True)
            legs[f"{sname}·{name}"] = leg_net_ret(fn(close), close)
    # 腿序列都是 RangeIndex(0..T-1)，先按位置对齐成 DataFrame，再统一挂日期索引
    legs_df = pd.DataFrame(legs)
    legs_df.index = base_dates
    print(f"[panel] 16 腿面板 {legs_df.shape[0]} 行 × {legs_df.shape[1]} 列")

    # 3) 组合收益序列
    buyhold_eq = frames["600519"]["close"].pct_change().fillna(0.0)
    for sym in list(SYMBOLS)[1:]:
        buyhold_eq = buyhold_eq + frames[sym]["close"].pct_change().fillna(0.0)
    buyhold_eq = pd.Series((buyhold_eq / len(SYMBOLS)).values, index=base_dates)

    rets = {
        "bh_equal": ("买入持有·等权4标的", buyhold_eq),
        "dual_ma_avg": ("双均线×4标的等权", legs_df[[c for c in legs_df if c.startswith("双均线")]].mean(axis=1)),
        "eq16": ("等权16腿", legs_df.mean(axis=1)),
        "rp16": ("风险平价16腿", risk_parity_ret(legs_df)),
        "vt16": ("波动率目标16腿", vol_target_ret(legs_df)),
    }
    # 再补 4 个"单策略×4标的等权"用于相关性矩阵与对照
    for skey, sname, fn in STRATS:
        cols = [c for c in legs_df if c.startswith(sname)]
        rets[f"strat_{skey}"] = (f"{sname}×4标的", legs_df[cols].mean(axis=1))

    # 4) 全周期 / 样本外指标
    def table(rows):
        out = []
        for key in rows:
            name, ret = rows[key]
            m = metrics(ret)
            m["name"] = name
            out.append(m)
        return out

    full_ret = {k: v for k, v in rets.items() if not k.startswith("strat_")}
    oos_ret = {k: (v[0], v[1][v[1].index >= OOS_START]) for k, v in full_ret.items()}
    strat_ret = {k: v for k, v in rets.items() if k.startswith("strat_")}
    strat_oos = {k: (v[0], v[1][v[1].index >= OOS_START]) for k, v in strat_ret.items()}

    # 5) 分散化统计（全周期）
    leg_vols = legs_df.std() * np.sqrt(252)
    eq16_vol = metrics(rets["eq16"][1])["volatility"]
    div_ratio = float(leg_vols.mean() / eq16_vol)
    corr = legs_df.corr()
    avg_abs_corr = float(corr.values[np.triu_indices_from(corr.values, 1)].mean())

    # 6) 策略层相关性矩阵（4×4，用于热图）：各策略 ×4 标的等权组合收益的相关系数
    s_names, s_matrix = [], []
    for skey, sname, fn in STRATS:
        s_names.append(sname)
        row = []
        for skey2, sname2, fn2 in STRATS:
            a = rets[f"strat_{skey}"][1]
            b = rets[f"strat_{skey2}"][1]
            row.append(round(float(a.corr(b)), 3))
        s_matrix.append(row)

    # 7) 导出（净值曲线采样 ~250 点）
    step = max(1, len(base_dates) // 250)
    sidx = sorted(set(list(range(0, len(base_dates), step)) + [len(base_dates) - 1]))

    def equity_series(ret):
        return (1 + ret).cumprod()

    out = {
        "dates": [base_dates.iloc[i].strftime("%Y-%m-%d") for i in sidx],
        "portfolios": {
            key: {
                "name": name,
                "color": COLOR[key],
                "equity": [round(float(equity_series(ret).iloc[i]), 4) for i in sidx],
            }
            for key, (name, ret) in full_ret.items()
        },
        "table": {
            "full": table(full_ret),
            "oos": table(oos_ret),
            "strat": table(strat_ret),
            "strat_oos": table(strat_oos),
        },
        "corr": {"strategies": s_names, "matrix": s_matrix},
        "stats": {
            "avg_leg_vol": float(leg_vols.mean()),
            "eq16_vol": eq16_vol,
            "diversification_ratio": div_ratio,
            "avg_abs_corr": avg_abs_corr,
            "n_legs": int(legs_df.shape[1]),
        },
    }

    os.makedirs(ARTICLE_DIR, exist_ok=True)
    with open(os.path.join(ARTICLE_DIR, "portfolio_build.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)

    # 8) 控制台汇总
    def fmt(m):
        return (f"{m['name']:<16} {m['total_return']*100:>8.2f}% {m['annual_return']*100:>8.2f}% "
                f"{m['max_drawdown']*100:>8.2f}% {m['sharpe']:>6.2f} {m['volatility']*100:>7.2f}%")

    print("\n=== 全周期 (2018-2025) ===")
    print(f"{'组合':<16} {'总收益':>9} {'年化':>9} {'回撤':>9} {'夏普':>7} {'年化波动':>9}")
    for m in out["table"]["full"]:
        print(fmt(m))
    print("\n=== 单策略×4标的等权（组合中间层）===")
    for m in out["table"]["strat"]:
        print(fmt(m))
    print("\n=== 样本外 (2023-2025) ===")
    for m in out["table"]["oos"]:
        print(fmt(m))

    print(f"\n[stats] 16 腿平均年化波动 {leg_vols.mean()*100:.2f}% vs 等权组合波动 {eq16_vol*100:.2f}%")
    print(f"[stats] 分散化收益比 = {div_ratio:.2f}（>1 说明组合波动低于各腿平均波动）")
    print(f"[stats] 16 腿平均绝对相关系数 = {avg_abs_corr:.3f}")
    print("\n策略层相关性矩阵（各策略×4标的等权组合）:")
    print("        " + "  ".join(f"{n:<12}" for n in s_names))
    for n, row in zip(s_names, s_matrix):
        print(f"{n:<12}" + "  ".join(f"{v:>12.3f}" for v in row))

    print(f"\n[done] portfolio_build.json -> {os.path.join(ARTICLE_DIR, 'portfolio_build.json')}")


COLOR = {
    "bh_equal": "#9ca3af",
    "dual_ma_avg": "#f59e0b",
    "eq16": "#2563eb",
    "rp16": "#10b981",
    "vt16": "#7c3aed",
}


if __name__ == "__main__":
    main()
