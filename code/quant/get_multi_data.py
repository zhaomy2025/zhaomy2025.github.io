"""
多标的真实数据获取（策略扩展第一篇：多标的验证双均线）
====================================================
对一篮子 A 股取前复权日线，落盘为 <code>_qfq.csv，供 beyond_dual_ma.py 直接读。
akshare 网络抖，单只重试 4 次再放弃；已有 CSV 跳过（可重跑补缺失）。

复现：python get_multi_data.py
"""
import os
import time
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
SYMBOLS = {
    "600519": "贵州茅台",
    "600036": "招商银行",
    "000858": "五粮液",
    "300750": "宁德时代",
    "601318": "中国平安",
}
START, END = "20180101", "20251231"


def fetch_one(sym: str):
    import akshare as ak
    for attempt in range(4):
        try:
            df = ak.stock_zh_a_hist(symbol=sym, period="daily",
                                    start_date=START, end_date=END, adjust="qfq")
            df = df.rename(columns={"日期": "date", "收盘": "close"})
            df = df[["date", "close"]].copy()
            df["date"] = df["date"].astype(str)
            if len(df) > 50:
                return df
        except Exception as e:
            print(f"  {sym} attempt {attempt} fail: {repr(e)[:100]}")
            time.sleep(2)
    return None


def main():
    for sym, name in SYMBOLS.items():
        out = os.path.join(HERE, f"{sym}_qfq.csv")
        if os.path.exists(out):
            print(f"[skip] {sym} {name} 已有 {os.path.basename(out)}")
            continue
        print(f"[fetch] {sym} {name} ...")
        df = fetch_one(sym)
        if df is None:
            print(f"[fail] {sym} {name} 取数失败，跳过")
            continue
        df.to_csv(out, index=False, encoding="utf-8")
        print(f"[ok] {sym} {name} {len(df)} 根 -> {os.path.basename(out)}")


if __name__ == "__main__":
    main()
