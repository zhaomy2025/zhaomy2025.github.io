"""稳健取数：akshare 重试多次，落盘为 maotai_600519_qfq.csv（真实前复权日线）。
下游 dual_ma_backtest.py / dual_ma_oos.py 优先读这个本地文件，避免网络抖动时
误用合成数据冒充真实。"""
import sys
import os
import time
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
SYMBOL = "600519"
START = "20180101"
END = "20251231"
CSV = os.path.join(HERE, "maotai_600519_qfq.csv")


def fetch():
    import akshare as ak
    df = ak.stock_zh_a_hist(symbol=SYMBOL, period="daily",
                            start_date=START, end_date=END, adjust="qfq")
    df = df.rename(columns={"日期": "date", "收盘": "close"})
    df["date"] = pd.to_datetime(df["date"])
    df = df[["date", "close"]].sort_values("date").reset_index(drop=True)
    if len(df) <= 50:
        raise RuntimeError(f"数据过少 {len(df)} 根")
    return df


def main():
    df = None
    for i in range(6):
        try:
            df = fetch()
            print(f"[ok] akshare 取数成功（第{i+1}次），{len(df)} 根")
            break
        except Exception as e:
            print(f"[warn] 第{i+1}次失败：{e}", file=sys.stderr)
            time.sleep(2)
    if df is None:
        print("[fail] 真实数据多次取数失败，请检查网络后重试", file=sys.stderr)
        sys.exit(1)

    df.to_csv(CSV, index=False, date_format="%Y-%m-%d")
    print(f"[save] {CSV}  首 {df['date'].iloc[0].date()} 收 {df['close'].iloc[0]:.2f} | "
          f"尾 {df['date'].iloc[-1].date()} 收 {df['close'].iloc[-1]:.2f}")
    bh = (df['close'].iloc[-1] / df['close'].iloc[0] - 1) * 100
    print(f"[check] 买入持有收益 ≈ {bh:.2f}%  区间 {df['date'].min().date()}~{df['date'].max().date()}")


if __name__ == "__main__":
    main()
