"""
策略扩展 · 第一篇：多标的验证双均线
===================================
同一个双均线(快5/慢20)框架，原封不动跑一篮子 A 股，看它在茅台之外灵不灵。
直接回答：双均线能跑，是不是只是茅台的巧合？

做法：
  1. 对每标的读本地 <code>_qfq.csv（2018-2025 前复权日线）
  2. 全周期跑 backtest(5,20) 得 总收益 / 买入持有 / 夏普 / 回撤 / 交易次数
  3. 样本外(2023-2025)再跑一次，看"训练期牛市里有效"的策略在新区间是否还灵
  4. 导出对比 json（供 build_note.py 生成笔记）

复用：from dual_ma_backtest import backtest  （白盒回测，逻辑与双均线文一致）

输出：beyond_dual_ma.json（对比表 + 多标的净值曲线）
"""
import os
import sys
import json
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
# 复用双均线文的回测函数（同一套真实成本假设，同在 docs/code/quant/）
sys.path.insert(0, HERE)
from dual_ma_backtest import backtest  # noqa: E402

SYMBOLS = {
    "600519": "贵州茅台",
    "600036": "招商银行",
    "000858": "五粮液",
    "300750": "宁德时代",
    "601318": "中国平安",
}
OOS_START = pd.Timestamp("2023-01-01")


def load(sym: str):
    p = os.path.join(HERE, f"{sym}_qfq.csv")
    if not os.path.exists(p):
        return None
    df = pd.read_csv(p, parse_dates=["date"]).sort_values("date").reset_index(drop=True)
    if len(df) <= 50:
        return None
    # 数据质量门：akshare 前复权对高送转次新股偶发负价/缺失，必须剔除，
    # 否则 (1+ret).cumprod() 会崩成离谱数值污染结论（曾出现 -17274%）
    bad = (df["close"] <= 0) | df["close"].isna()
    if bad.any():
        print(f"[dirty] {sym} 含负价/缺失({int(bad.sum())}处)，前复权复权异常，跳过")
        return None
    return df


def main():
    rows = []
    nav = {}        # code -> {"dates":[...], "equity":[...]} 双均线净值（归一化到首日=1）
    nav_bh = {}     # code -> 买入持有净值（归一化到首日=1）
    for sym, name in SYMBOLS.items():
        df = load(sym)
        if df is None:
            print(f"[skip] {sym} {name} 无数据")
            continue
        close = df["close"].reset_index(drop=True)
        r = backtest(close, 5, 20)

        oos = df[df["date"] >= OOS_START].reset_index(drop=True)
        r_oos = backtest(oos["close"].reset_index(drop=True), 5, 20) if len(oos) > 50 else None

        beat = r["total_return"] > r["buyhold_return"]
        rows.append({
            "code": sym, "name": name,
            "total_return": r["total_return"],
            "buyhold_return": r["buyhold_return"],
            "oos_return": (r_oos["total_return"] if r_oos else None),
            "oos_buyhold": (r_oos["buyhold_return"] if r_oos else None),
            "sharpe": r["sharpe"],
            "max_drawdown": r["max_drawdown"],
            "n_trades": r["n_trades"],
            "win_rate": r["win_rate"],
            "beat": beat,
        })
        print(f"{name:<6} 总收益 {r['total_return']*100:7.2f}%  持有 {r['buyhold_return']*100:7.2f}%  "
              f"{'跑赢' if beat else '跑输'}  夏普 {r['sharpe']:.2f}  回撤 {r['max_drawdown']*100:.1f}%  "
              f"样本外 {('%.2f%%'%(r_oos['total_return']*100)) if r_oos else 'NA'}")

        # 净值（复用 backtest 内部逻辑导出，避免重复实现）
        ma_f = close.rolling(5).mean()
        ma_s = close.rolling(20).mean()
        pos = (ma_f > ma_s).astype(float).shift(1).fillna(0.0)
        ret = close.pct_change().fillna(0.0)
        chg = pos.diff().fillna(pos.iloc[0])
        cost = chg.abs() * (0.0003 * 2 + 0.0005 + 0.001 * 2)
        eq = (1 + pos * ret - cost).cumprod()
        if pos.iloc[0] > 0:
            eq.iloc[0] -= 0.0003 + 0.001
        bh = (1 + ret).cumprod()
        nav[sym] = {
            "dates": [d.strftime("%Y-%m-%d") for d in df["date"]],
            "equity": [round(float(v), 4) for v in eq],
            "buyhold": [round(float(v), 4) for v in bh],
            "name": name,
        }

    out = {"rows": rows, "nav": nav}
    # 数据缓存随脚本放 code/quant（与 _qfq.csv 并列）；文章目录只放 .md + 图表产物
    with open(os.path.join(HERE, "beyond_dual_ma.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)
    print(f"\n[done] {len(rows)} 只标的数据 -> {os.path.join(HERE, 'beyond_dual_ma.json')}")


if __name__ == "__main__":
    main()
