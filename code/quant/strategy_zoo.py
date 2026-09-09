"""
多策略横评回测（纯 pandas，A 股真实日线）
=========================================
同一只票、同一套真实成本假设下，把四个常见趋势/反转策略摆在一起比：
  1. 双均线 (fast=5, slow=20)            —— 已在前文验证过，作基准
  2. 均线+动量过滤 (5/20 + 60日动量>0)   —— 双均线的"降噪"版
  3. 布林带 (20, 2σ)                     —— 均值回复思路（下轨买、中轨卖）
  4. 海龟 (唐奇安通道 20/10)              —— 突破跟随思路（创20日高买、破10日低卖）

为什么做这个：前文证明"双均线跑输买入持有"是通病，那是不是换个策略就能赢？
答案要真刀真枪比出来，而不是拍脑袋。所有策略共用 dual_ma_backtest 的成本假设，
保证对比公平（同样的佣金/印花税/滑点、同样 T+1 次日成交、同样长仓-only）。

数据源：本地落盘真实数据 maotai_600519_qfq.csv（前复权，2018-2025，1943 根）。
输出：strategy_zoo.json（净值曲线 + 全周期/样本外对比表），供 build_strategy_zoo_note.py 生成文章。
"""

import os
import json
import numpy as np
import pandas as pd

# 脚本固定在 docs/code/quant/；文章与图表产物固定在 docs/quant/strategy-zoo/
HERE = os.path.dirname(os.path.abspath(__file__))
ARTICLE_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "quant", "strategy-zoo"))

# 复用双均线的真实成本假设，保证横评公平
from dual_ma_backtest import COMMISSION, STAMP, SLIPPAGE  # noqa: E402


def load_maotai():
    p = os.path.join(HERE, "maotai_600519_qfq.csv")
    df = pd.read_csv(p, parse_dates=["date"]).sort_values("date").reset_index(drop=True)
    return df


def run_strategy(position: pd.Series, close: pd.Series) -> dict:
    """用与 dual_ma_backtest.backtest 完全一致的成本逻辑，跑一个 position 序列。"""
    position = position.astype(float)
    ret = close.pct_change().fillna(0.0)
    strat_ret = position * ret

    # 交易成本：持仓状态变化时扣除（开仓+平仓各计一次）
    change = position.diff().fillna(position.iloc[0])
    turnover = change.abs()
    cost = turnover * (COMMISSION * 2 + STAMP + SLIPPAGE * 2)
    strat_ret_net = strat_ret - cost
    if position.iloc[0] > 0:
        strat_ret_net.iloc[0] -= COMMISSION + SLIPPAGE

    equity = (1 + strat_ret_net).cumprod()
    buy_hold = (1 + ret).cumprod()

    peak = equity.cummax()
    mdd = ((equity - peak) / peak).min()

    entries = np.where(change == 1)[0]
    exits = np.where(change == -1)[0]
    trade_rets = []
    for i, e in enumerate(entries):
        x = exits[i] if i < len(exits) else len(close) - 1
        trade_rets.append(equity.iloc[x] / equity.iloc[e] - 1)
    win_rate = np.mean([r > 0 for r in trade_rets]) if trade_rets else 0.0

    total_days = len(close)
    years = total_days / 252
    total_ret = equity.iloc[-1] - 1
    ann = equity.iloc[-1] ** (1 / years) - 1 if years > 0 else 0
    vol = strat_ret_net.std() * np.sqrt(252)
    sharpe = (strat_ret_net.mean() * 252) / (vol + 1e-9)

    return {
        "total_return": float(total_ret),
        "annual_return": float(ann),
        "max_drawdown": float(mdd),
        "sharpe": float(sharpe),
        "volatility": float(vol),
        "n_trades": int(len(trade_rets)),
        "win_rate": float(win_rate),
        "buyhold_return": float(buy_hold.iloc[-1] - 1),
        "equity": equity.values,
    }


# ---------------- 四个策略：返回 position 序列（已 shift 1 避免未来函数） ----------------

def pos_dual_ma(close):
    ma_f = close.rolling(5).mean()
    ma_s = close.rolling(20).mean()
    sig = (ma_f > ma_s).astype(float)
    return sig.shift(1).fillna(0.0)


def pos_ma_momentum(close):
    """双均线金叉 + 60 日动量>0 才持仓：过滤掉"金叉但仍在长期下行"的假突破。"""
    ma_f = close.rolling(5).mean()
    ma_s = close.rolling(20).mean()
    mom = close / close.rolling(60).mean() - 1
    sig = ((ma_f > ma_s) & (mom > 0)).astype(float)
    return sig.shift(1).fillna(0.0)


def pos_bollinger(close):
    """布林带(20,2σ) 均值回复：价格下穿下轨买入，上穿中轨卖出。状态机实现。"""
    ma = close.rolling(20).mean()
    sd = close.rolling(20).std()
    lower = ma - 2 * sd
    middle = ma
    n = len(close)
    pos = np.zeros(n)
    holding = False
    for i in range(n):
        c = close.iloc[i]
        if not holding and c <= lower.iloc[i]:
            pos[i] = 1; holding = True
        elif holding and c >= middle.iloc[i]:
            pos[i] = 0; holding = False
        else:
            pos[i] = 1 if holding else 0
    return pd.Series(pos, index=close.index).shift(1).fillna(0.0)


def pos_turtle(close):
    """海龟/唐奇安通道(20/10)：创20日新高买入，破10日新低卖出。状态机实现。"""
    hi20 = close.rolling(20).max()
    lo10 = close.rolling(10).min()
    n = len(close)
    pos = np.zeros(n)
    holding = False
    for i in range(1, n):
        c = close.iloc[i]
        h = hi20.iloc[i - 1]
        l = lo10.iloc[i - 1]
        if not holding and c > h:
            pos[i] = 1; holding = True
        elif holding and c < l:
            pos[i] = 0; holding = False
        else:
            pos[i] = 1 if holding else 0
    return pd.Series(pos, index=close.index).shift(1).fillna(0.0)


STRATS = [
    ("dual_ma", "双均线(5/20)", "#f59e0b", pos_dual_ma),
    ("ma_mom", "均线+动量", "#2563eb", pos_ma_momentum),
    ("boll", "布林带(20,2σ)", "#10b981", pos_bollinger),
    ("turtle", "海龟(20/10)", "#7c3aed", pos_turtle),
]


def evaluate(close: pd.Series):
    out = {}
    equities = {}
    for key, name, color, fn in STRATS:
        r = run_strategy(fn(close), close)
        r["name"] = name
        r["color"] = color
        equities[key] = r.pop("equity")
        out[key] = r
    return out, equities


def main():
    df = load_maotai()
    close = df["close"].reset_index(drop=True)
    dates = df["date"]
    print(f"[data] 本地真实数据 600519（{dates.min().date()}~{dates.max().date()}，{len(close)} 根）")

    full, full_eq = evaluate(close)

    # 样本外：2023-01-01 起，用同样参数在独立区间回测
    mask = dates >= pd.Timestamp("2023-01-01")
    sub_idx = np.where(mask.values)[0]
    sub_close = close.iloc[sub_idx].reset_index(drop=True)
    oos, _ = evaluate(sub_close)

    buy_hold_full = (1 + close.pct_change().fillna(0.0)).cumprod()

    # 精简采样（约 250 点）供 echarts
    step = max(1, len(close) // 250)
    sidx = sorted(set(list(range(0, len(close), step)) + [len(close) - 1]))

    out = {
        "dates": [dates.iloc[i].strftime("%Y-%m-%d") for i in sidx],
        "buyhold": [round(float(buy_hold_full.iloc[i]), 4) for i in sidx],
        "strategies": {
            key: {
                "name": full[key]["name"],
                "color": full[key]["color"],
                "equity": [round(float(full_eq[key][i]), 4) for i in sidx],
            }
            for key in full_eq
        },
        "table": {
            "full": [{k: v for k, v in full[key].items() if k != "equity"} for key in full],
            "oos": [{k: v for k, v in oos[key].items()} for key in oos],
        },
    }

    os.makedirs(ARTICLE_DIR, exist_ok=True)
    with open(os.path.join(ARTICLE_DIR, "strategy_zoo.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)

    # 控制台打印对比表
    def fmt_row(r):
        return (f"{r['name']:<12} {r['total_return']*100:>8.2f}% "
                f"{r['annual_return']*100:>8.2f}% {r['max_drawdown']*100:>8.2f}% "
                f"{r['sharpe']:>6.2f} {r['n_trades']:>5} {r['win_rate']*100:>7.2f}% "
                f"{r['buyhold_return']*100:>9.2f}%")

    print("\n=== 全周期 (2018-2025) 对比 ===")
    print(f"{'策略':<12} {'总收益':>9} {'年化':>9} {'回撤':>9} {'夏普':>7} {'次数':>6} {'胜率':>8} {'持有':>10}")
    for key in full:
        print(fmt_row(full[key]))
    print("\n=== 样本外 (2023-2025) 对比 ===")
    for key in oos:
        print(fmt_row(oos[key]))

    print("\n[done] strategy_zoo.json 已写出 ->", os.path.join(ARTICLE_DIR, "strategy_zoo.json"))


if __name__ == "__main__":
    main()
