"""
双均线策略 · 样本外验证（train / test split）
============================================
量化第一步只做了"真实数据 + 真实成本"，并留下悬念：参数扫描里"最优"的
那个参数，在没见过的未来还灵不灵？本脚本把这件事做实。

做法（最朴素的样本外检验）：
  1. 用 2018-2022（5 年）做样本内（in-sample）调参，找出收益最高的参数
  2. 把这组"冠军参数"原封不动拿到 2023-2025（3 年）做样本外（out-of-sample）
  3. 对照：冠军参数 vs 默认参数(5/20) vs 买入持有，在样本外的表现
  4. 再算"样本外也作弊挑最优"（上界），看冠军参数离上界有多远、排名多少

复现：python dual_ma_oos.py （需 pandas / numpy / akshare）
输出：dual_ma_oos.json（全量净值）、dual_ma_oos_small.json（约 200 点，供 echarts）
"""

import os
import json
import numpy as np
import pandas as pd
from dual_ma_backtest import fetch_data, backtest, COMMISSION, STAMP, SLIPPAGE

HERE = os.path.dirname(os.path.abspath(__file__))
ARTICLE_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "quant", "dual-ma"))

IN_END = "2022-12-31"      # 样本内截止
OOS_START = "2023-01-01"   # 样本外起始


def nav(close: pd.Series, fast: int, slow: int) -> pd.Series:
    """复算净值曲线（与 backtest 内部逻辑一致），用于导出图表。"""
    ma_f = close.rolling(fast).mean()
    ma_s = close.rolling(slow).mean()
    pos = (ma_f > ma_s).astype(float).shift(1).fillna(0.0)  # 次日收盘成交
    ret = close.pct_change().fillna(0.0)
    sr = pos * ret
    chg = pos.diff().fillna(pos.iloc[0])
    cost = chg.abs() * (COMMISSION * 2 + STAMP + SLIPPAGE * 2)
    sr_net = sr - cost
    if pos.iloc[0] > 0:
        sr_net.iloc[0] -= COMMISSION + SLIPPAGE
    return (1 + sr_net).cumprod()


def scan(close):
    """快∈{5,10,15,20} × 慢∈{20,30,40,50,60}，返回按收益降序的列表。"""
    res = []
    for f in (5, 10, 15, 20):
        for s in (20, 30, 40, 50, 60):
            if f >= s:
                continue
            res.append(backtest(close, f, s))
    res.sort(key=lambda x: x["total_return"], reverse=True)
    return res


def main():
    df, src = fetch_data()
    print(f"[data] {src}")
    df["date"] = pd.to_datetime(df["date"])
    ins = df[df["date"] <= IN_END].reset_index(drop=True)
    oos = df[df["date"] >= OOS_START].reset_index(drop=True)
    c_ins = ins["close"].reset_index(drop=True)
    c_oos = oos["close"].reset_index(drop=True)
    print(f"[split] 样本内 {ins['date'].min().date()}~{ins['date'].max().date()} ({len(ins)} 根) | "
          f"样本外 {oos['date'].min().date()}~{oos['date'].max().date()} ({len(oos)} 根)")

    # 1) 样本内扫描找冠军
    ins_scan = scan(c_ins)
    champ = ins_scan[0]

    # 2) 样本外扫描（作弊上界）
    oos_scan = scan(c_oos)
    oos_best = oos_scan[0]

    champ_ins = backtest(c_ins, champ["fast"], champ["slow"])
    champ_oos = backtest(c_oos, champ["fast"], champ["slow"])
    default_ins = backtest(c_ins, 5, 20)
    default_oos = backtest(c_oos, 5, 20)
    bh_oos = default_oos["buyhold_return"]

    # 冠军 / 默认 在样本外的排名
    champ_rank = [i for i, r in enumerate(oos_scan)
                  if r["fast"] == champ["fast"] and r["slow"] == champ["slow"]][0] + 1
    default_rank = [i for i, r in enumerate(oos_scan)
                    if r["fast"] == 5 and r["slow"] == 20][0] + 1

    print("\n=== 样本内冠军 ===")
    print(f"快{champ['fast']}/慢{champ['slow']}  样本内收益 {champ_ins['total_return']*100:.2f}%  "
          f"夏普 {champ_ins['sharpe']:.2f}  交易 {champ_ins['n_trades']} 次")
    print("\n=== 样本外对照 (2023-2025) ===")
    print(f"{'方案':<30}{'样本内收益':>12}{'样本外收益':>12}{'oos排名':>8}{'跑赢持有':>8}")
    rows = [
        (f"样本内冠军(快{champ['fast']}/慢{champ['slow']})",
         champ_ins['total_return'], champ_oos['total_return'], champ_rank),
        ("默认(快5/慢20)",
         default_ins['total_return'], default_oos['total_return'], default_rank),
        (f"样本外作弊最优(快{oos_best['fast']}/慢{oos_best['slow']})",
         None, oos_best['total_return'], 1),
    ]
    for name, ri, ro, rk in rows:
        beat = "是" if ro > bh_oos else "否"
        ri_s = f"{ri*100:11.2f}%" if ri is not None else f"{'—':>12}"
        print(f"{name:<30}{ri_s:>12}{ro*100:11.2f}%{rk:>8}{beat:>10}")

    print(f"\n样本外买入持有收益 : {bh_oos*100:.2f}%")
    print(f"冠军 -> 样本外      : {champ_oos['total_return']*100:.2f}%  (在 {len(oos_scan)} 组参数里排第 {champ_rank})")
    print(f"默认 -> 样本外      : {default_oos['total_return']*100:.2f}%  (排第 {default_rank})")
    print(f"样本外作弊上界      : {oos_best['total_return']*100:.2f}%  (快{oos_best['fast']}/慢{oos_best['slow']})")
    decay = (champ_oos['total_return'] - champ_ins['total_return']) * 100
    print(f"冠军参数收益衰减    : {decay:+.2f} pct（样本内 {champ_ins['total_return']*100:.2f}% -> 样本外 {champ_oos['total_return']*100:.2f}%）")

    # 3) 导出图表数据
    nav_champ = nav(c_oos, champ['fast'], champ['slow'])
    nav_default = nav(c_oos, 5, 20)
    nav_bh = (1 + c_oos.pct_change().fillna(0.0)).cumprod()
    full = {
        "dates": [d.strftime('%Y-%m-%d') for d in oos['date']],
        "champ_equity": [round(float(v), 4) for v in nav_champ],
        "default_equity": [round(float(v), 4) for v in nav_default],
        "buyhold": [round(float(v), 4) for v in nav_bh],
    }
    with open(os.path.join(ARTICLE_DIR, "dual_ma_oos.json"), "w", encoding="utf-8") as f:
        json.dump(full, f, ensure_ascii=False)

    step = max(1, len(c_oos) // 200)
    idx = sorted(set(list(range(0, len(c_oos), step)) + [len(c_oos) - 1]))
    small = {
        "dates": [oos['date'].iloc[i].strftime('%Y-%m-%d') for i in idx],
        "champ_equity": [round(float(nav_champ.iloc[i]), 4) for i in idx],
        "default_equity": [round(float(nav_default.iloc[i]), 4) for i in idx],
        "buyhold": [round(float(nav_bh.iloc[i]), 4) for i in idx],
        "champ_params": [champ['fast'], champ['slow']],
        "default_params": [5, 20],
        "metrics": {
            "champ_ins_return": champ_ins['total_return'],
            "champ_oos_return": champ_oos['total_return'],
            "default_ins_return": default_ins['total_return'],
            "default_oos_return": default_oos['total_return'],
            "oos_best_return": oos_best['total_return'],
            "oos_best_params": [oos_best['fast'], oos_best['slow']],
            "buyhold_oos_return": bh_oos,
            "champ_oos_rank": champ_rank,
            "default_oos_rank": default_rank,
            "n_oos_params": len(oos_scan),
        },
    }
    with open(os.path.join(ARTICLE_DIR, "dual_ma_oos_small.json"), "w", encoding="utf-8") as f:
        json.dump(small, f, ensure_ascii=False)
    print("\n[done] 已写出 dual_ma_oos.json / dual_ma_oos_small.json")


if __name__ == "__main__":
    main()
