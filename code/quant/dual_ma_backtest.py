"""
双均线策略回测（纯 pandas 实现，A 股真实日线）
================================================
目标：跑通一个"真实"的双均线（金叉/死叉）回测，理解回测引擎到底在干什么。
"真实"的三要素：
  1. 真实历史数据（前复权日线，不用随机游走）
  2. 真实交易成本（佣金 + 印花税 + 滑点）
  3. 真实交易约束（A 股 T+1、不能做空、涨跌停无法成交用滑点近似）

为什么不用 vectorbt：
  vectorbt 经典版要求 Python<=3.11，而当前沙箱环境装 3.11 受阻。
  自写 150 行极简回测反而是原计划的"第二步"——把引擎从黑盒变白盒，
  你会突然明白快/慢均线、信号滞后、成本为啥存在。

数据源：
  akshare stock_zh_a_hist（前复权），失败则回退 yfinance，再失败则明确标注为合成数据。

输出：
  - 控制台打印核心指标 + 参数扫描结论
  - dual_ma_equity.json：净值曲线（供 VuePress echarts 嵌入）
  - dual_ma_equity.png：静态图（兜底）
"""

import json
import sys
import os
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# ---------------- 路径 ----------------
# 脚本固定在 docs/code/quant/；文章与图表产物固定在 docs/quant/<topic>/
HERE = os.path.dirname(os.path.abspath(__file__))
ARTICLE_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "quant", "dual-ma"))

# ---------------- 配置 ----------------
SYMBOL = "600519"          # 贵州茅台
FAST = 5
SLOW = 20
START = "20180101"
END = "20251231"
COMMISSION = 0.0003        # 双边佣金 万3
STAMP = 0.0005             # 印花税 卖出方 万5（2023 起减半）
SLIPPAGE = 0.001           # 滑点 单边 0.1%（涨跌停无法成交的近似）
INIT_CAPITAL = 1_000_000


def fetch_data():
    """取真实日线，失败层层回退。返回 (df, source_desc)。"""
    # 0) 优先用已落盘的真实数据。网络抖动时避免误用合成数据冒充真实
    try:
        csv_path = os.path.join(HERE, "maotai_600519_qfq.csv")
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path, parse_dates=["date"])
            df = df[["date", "close"]].sort_values("date").reset_index(drop=True)
            if len(df) > 50:
                return df, f"本地落盘真实数据 600519（{df['date'].min().date()}~{df['date'].max().date()}，{len(df)} 根）"
    except Exception as e:
        print(f"[warn] 读取本地数据失败：{e}", file=sys.stderr)

    # 1) akshare A 股前复权（瞬断很常见，重试几次再放弃，避免误用合成数据冒充真实）
    for _attempt in range(3):
        try:
            import akshare as ak
            df = ak.stock_zh_a_hist(symbol=SYMBOL, period="daily",
                                    start_date=START, end_date=END, adjust="qfq")
            df = df.rename(columns={"日期": "date", "收盘": "close"})
            df["date"] = pd.to_datetime(df["date"])
            df = df[["date", "close"]].sort_values("date").reset_index(drop=True)
            if len(df) > 50:
                return df, f"akshare 前复权日线 {SYMBOL}（{df['date'].min().date()}~{df['date'].max().date()}，{len(df)} 根）"
        except Exception as e:
            print(f"[warn] akshare 取数失败(第{_attempt+1}次)：{e}", file=sys.stderr)
    else:
        print("[warn] akshare 3 次取数均失败，转下一数据源", file=sys.stderr)

    # 2) yfinance 美股（全球可达，作为真实数据兜底）
    try:
        import yfinance as yf
        df = yf.download("AAPL", start=START, end=END, auto_adjust=True, progress=False)
        df = df[["Close"]].reset_index().rename(columns={"Close": "close", "Date": "date"})
        if len(df) > 50:
            return df, f"yfinance AAPL（akshare 不可用时的真实数据兜底，{len(df)} 根）"
    except Exception as e:
        print(f"[warn] yfinance 取数失败：{e}", file=sys.stderr)

    # 3) 合成（明确标注，绝不冒充真实）
    print("[warn] 真实数据源均不可用，回退合成数据（几何随机游走，仅用于验证代码路径）", file=sys.stderr)
    n = 2000
    rng = np.random.default_rng(42)
    dates = pd.bdate_range(START, periods=n)
    close = 100 * np.cumprod(1 + rng.normal(0.0003, 0.015, n))
    return pd.DataFrame({"date": dates, "close": close}), "合成数据（GEOMETRIC RANDOM WALK，非真实）"


def backtest(close: pd.Series, fast: int, slow: int) -> dict:
    """单组参数的向量化回测。长仓-only，次日收盘成交（T+1 近似）。"""
    ma_fast = close.rolling(fast).mean()
    ma_slow = close.rolling(slow).mean()
    signal = (ma_fast > ma_slow).astype(float)      # 1=持仓, 0=空仓
    # 次日收盘成交：信号滞后 1 日，避免未来函数
    position = signal.shift(1).fillna(0.0)

    ret = close.pct_change().fillna(0.0)
    strat_ret = position * ret

    # 交易成本：持仓状态变化时扣除（开仓+平仓各计一次）
    change = position.diff().fillna(position.iloc[0])
    turnover = change.abs()
    cost = turnover * (COMMISSION * 2 + STAMP + SLIPPAGE * 2)  # 近似双边成本
    strat_ret_net = strat_ret - cost
    if position.iloc[0] > 0:
        strat_ret_net.iloc[0] -= COMMISSION + SLIPPAGE

    equity = (1 + strat_ret_net).cumprod()
    buy_hold = (1 + ret).cumprod()

    # 最大回撤
    peak = equity.cummax()
    mdd = ((equity - peak) / peak).min()

    # 交易明细（用于胜率）
    entries = np.where(change == 1)[0]
    exits = np.where(change == -1)[0]
    trade_rets = []
    for i, e in enumerate(entries):
        x = exits[i] if i < len(exits) else len(close) - 1
        tr = equity.iloc[x] / equity.iloc[e] - 1
        trade_rets.append(tr)
    win_rate = (np.mean([r > 0 for r in trade_rets]) if trade_rets else 0.0)

    total_days = len(close)
    years = total_days / 252
    total_ret = equity.iloc[-1] - 1
    ann = (equity.iloc[-1]) ** (1 / years) - 1 if years > 0 else 0
    vol = strat_ret_net.std() * np.sqrt(252)
    sharpe = (strat_ret_net.mean() * 252) / (strat_ret_net.std() * np.sqrt(252) + 1e-9)

    return {
        "fast": fast, "slow": slow,
        "total_return": float(total_ret),
        "annual_return": float(ann),
        "max_drawdown": float(mdd),
        "sharpe": float(sharpe),
        "volatility": float(vol),
        "n_trades": len(trade_rets),
        "win_rate": float(win_rate),
        "buyhold_return": float(buy_hold.iloc[-1] - 1),
    }


def main():
    df, src = fetch_data()
    print(f"[data] {src}")
    close = df["close"].reset_index(drop=True)

    # 主参数回测
    r = backtest(close, FAST, SLOW)
    print(f"\n=== 双均线 快{FAST}/慢{SLOW} 回测结果（{src}）===")
    print(f"策略总收益   : {r['total_return']*100:7.2f}%")
    print(f"年化收益     : {r['annual_return']*100:7.2f}%")
    print(f"最大回撤     : {r['max_drawdown']*100:7.2f}%")
    print(f"夏普(近似)  : {r['sharpe']:7.2f}")
    print(f"年化波动     : {r['volatility']*100:7.2f}%")
    print(f"交易次数     : {r['n_trades']}")
    print(f"胜率         : {r['win_rate']*100:7.2f}%")
    print(f"同期买入持有 : {r['buyhold_return']*100:7.2f}%")
    print(f"策略跑赢持有 : {('是' if r['total_return']>r['buyhold_return'] else '否')} "
          f"(差 {(r['total_return']-r['buyhold_return'])*100:+.2f}%)")

    # 参数扫描：展示"换个参数结论就变"
    print("\n=== 参数扫描（快∈{5,10,15,20} × 慢∈{20,30,40,50,60}）===")
    scan = []
    for f in (5, 10, 15, 20):
        for s in (20, 30, 40, 50, 60):
            if f >= s:
                continue
            rr = backtest(close, f, s)
            scan.append(rr)
    scan.sort(key=lambda x: x["total_return"], reverse=True)
    print(f"{'快':>3} {'慢':>3} {'总收益%':>9} {'年化%':>8} {'回撤%':>8} {'夏普':>6} {'胜率%':>7} {'次数':>5}")
    for rr in scan:
        print(f"{rr['fast']:>3} {rr['slow']:>3} {rr['total_return']*100:>9.2f} "
              f"{rr['annual_return']*100:>8.2f} {rr['max_drawdown']*100:>8.2f} "
              f"{rr['sharpe']:>6.2f} {rr['win_rate']*100:>7.2f} {rr['n_trades']:>5}")
    best, worst = scan[0], scan[-1]
    print(f"\n扫描区间最高 {best['total_return']*100:.2f}% (快{best['fast']}/慢{best['slow']}) "
          f"最低 {worst['total_return']*100:.2f}% (快{worst['fast']}/慢{worst['slow']})")
    print("→ 同一只票、同一逻辑，参数一换结论天差地别：这就是过拟合的真实样子。")

    # 导出净值曲线给 echarts
    ma_fast = close.rolling(FAST).mean()
    ma_slow = close.rolling(SLOW).mean()
    position = (ma_fast > ma_slow).astype(float).shift(1).fillna(0.0)
    strat_ret_net = position * close.pct_change().fillna(0.0)
    equity = (1 + strat_ret_net).cumprod()
    buy_hold = (1 + close.pct_change().fillna(0.0)).cumprod()
    out = {
        "dates": [d.strftime("%Y-%m-%d") for d in df["date"]],
        "close": [round(float(c), 2) for c in close],
        "ma_fast": [round(float(v), 2) if pd.notna(v) else None for v in ma_fast],
        "ma_slow": [round(float(v), 2) if pd.notna(v) else None for v in ma_slow],
        "equity": [round(float(v), 4) for v in equity],
        "buyhold": [round(float(v), 4) for v in buy_hold],
        "metrics": r,
    }
    with open(os.path.join(ARTICLE_DIR, "dual_ma_equity.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)

    # 静态图兜底（用英文标签避免中文缺字乱码）
    plt.figure(figsize=(11, 5))
    plt.plot(df["date"], equity.values, label="Dual-MA Strategy (NAV)", color="#2563eb")
    plt.plot(df["date"], buy_hold.values, label="Buy & Hold (NAV)", color="#9ca3af", alpha=0.8)
    plt.title(f"Dual Moving Average  fast={FAST}/slow={SLOW}  (NAV curve)")
    plt.legend(); plt.grid(alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(ARTICLE_DIR, "dual_ma_equity.png"), dpi=110)
    plt.close()

    # 精简版（约 200 点）供 VuePress echarts 内嵌，避免 md 过大
    step = max(1, len(close) // 200)
    idx = list(range(0, len(close), step)) + [len(close) - 1]
    idx = sorted(set(idx))
    small = {
        "dates": [df["date"].iloc[i].strftime("%Y-%m-%d") for i in idx],
        "close": [round(float(close.iloc[i]), 2) for i in idx],
        "ma_fast": [round(float(ma_fast.iloc[i]), 2) if pd.notna(ma_fast.iloc[i]) else None for i in idx],
        "ma_slow": [round(float(ma_slow.iloc[i]), 2) if pd.notna(ma_slow.iloc[i]) else None for i in idx],
        "equity": [round(float(equity.iloc[i]), 4) for i in idx],
        "buyhold": [round(float(buy_hold.iloc[i]), 4) for i in idx],
    }
    with open(os.path.join(ARTICLE_DIR, "dual_ma_equity_small.json"), "w", encoding="utf-8") as f:
        json.dump(small, f, ensure_ascii=False)
    print("\n[done] 已写出 dual_ma_equity.json / dual_ma_equity_small.json / dual_ma_equity.png")


if __name__ == "__main__":
    main()
