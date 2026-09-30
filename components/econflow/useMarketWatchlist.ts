"use client";

import { useEffect, useRef, useState } from "react";
import { watchlistUniverse, type WatchlistItem } from "@/data/market-overview";

const STORAGE_KEY = "econflow-market-watchlist-v2";

type PersistedWatchlist = {
  itemIds: string[];
  alertIds: string[];
};

const starterWatchlist: PersistedWatchlist = {
  itemIds: ["005930", "NVDA", "TSLA", "QQQ", "035420"],
  alertIds: [],
};

export function useMarketWatchlist() {
  const [state, setState] = useState<PersistedWatchlist>(starterWatchlist);
  const hydrated = useRef(false);

  useEffect(() => {
    let hydrationTimer: number | undefined;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<PersistedWatchlist>;
        const validIds = new Set(watchlistUniverse.map((item) => item.id));
        const nextState: PersistedWatchlist = {
          itemIds: (parsed.itemIds ?? []).filter((id) => validIds.has(id)),
          alertIds: (parsed.alertIds ?? []).filter((id) => validIds.has(id)),
        };
        hydrationTimer = window.setTimeout(() => {
          hydrated.current = true;
          setState(nextState);
        }, 0);
      } else {
        hydrated.current = true;
      }
    } catch {
      hydrated.current = true;
    }

    return () => {
      if (hydrationTimer !== undefined) window.clearTimeout(hydrationTimer);
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 관심종목은 현재 세션에서 계속 사용할 수 있습니다.
    }
  }, [state]);

  const add = (id: string) => setState((current) => current.itemIds.includes(id)
    ? current
    : { ...current, itemIds: [...current.itemIds, id] });

  const remove = (id: string) => setState((current) => ({
    itemIds: current.itemIds.filter((itemId) => itemId !== id),
    alertIds: current.alertIds.filter((itemId) => itemId !== id),
  }));

  const toggleAlert = (id: string) => setState((current) => ({
    ...current,
    alertIds: current.alertIds.includes(id)
      ? current.alertIds.filter((itemId) => itemId !== id)
      : [...current.alertIds, id],
  }));

  const items: WatchlistItem[] = state.itemIds.flatMap((id) => {
    const item = watchlistUniverse.find((entry) => entry.id === id);
    return item ? [{ ...item, alertEnabled: state.alertIds.includes(id) }] : [];
  });

  return {
    items,
    add,
    remove,
    toggleAlert,
    isSaved: (id: string) => state.itemIds.includes(id),
  };
}
