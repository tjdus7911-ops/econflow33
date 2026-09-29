import { AlertCircle, ArrowRight, Clock3, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import type { MarketDirection, MarketIndicator } from "@/data/market";

const categoryLabels = {
  stock: "주식",
  fx: "환율",
  rate: "금리",
  bond: "채권",
  commodity: "원자재",
} as const;

export const formatMarketValue = (indicator: MarketIndicator) => {
  const maximumFractionDigits = indicator.category === "rate" || indicator.category === "bond" ? 2 : 2;
  return `${indicator.value.toLocaleString("ko-KR", { maximumFractionDigits, minimumFractionDigits: maximumFractionDigits })}${indicator.unit}`;
};

const formatCompactMarketValue = (indicator: MarketIndicator) => {
  if (indicator.id === "jpy-krw") return `${indicator.value.toLocaleString("ko-KR", { minimumFractionDigits: 2 })}원`;
  if (indicator.id === "gold") return `$${indicator.value.toLocaleString("ko-KR", { minimumFractionDigits: 2 })}`;
  return formatMarketValue(indicator);
};

const linePoints = (values: number[], width: number, height: number, padding = 4) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values.map((value, index) => {
    const x = padding + index / Math.max(values.length - 1, 1) * (width - padding * 2);
    const y = height - padding - (value - min) / range * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
};

export function MiniSparkline({ values, direction }: { values: number[]; direction: MarketDirection }) {
  const color = direction === "down" ? "#2f80ed" : direction === "steady" ? "#8b98aa" : "#ef665b";
  return (
    <svg className="mini-sparkline" viewBox="0 0 92 34" role="img" aria-label="최근 흐름 미니 차트">
      <polyline points={linePoints(values, 92, 34)} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MarketIndicatorCard({ indicator, onClick }: { indicator: MarketIndicator; onClick: () => void }) {
  const DirectionIcon = indicator.direction === "down" ? TrendingDown : TrendingUp;
  const signedChange = `${indicator.change > 0 ? "+" : ""}${indicator.change.toFixed(2)}`;
  const signedPercent = `${indicator.changePercent > 0 ? "+" : ""}${indicator.changePercent.toFixed(2)}%`;
  return (
    <button className="market-indicator-card" data-direction={indicator.direction} onClick={onClick}>
      <span className="market-indicator-copy">
        <span className="market-card-top"><strong>{indicator.shortName}</strong><small>{categoryLabels[indicator.category]}</small></span>
        <b>{formatCompactMarketValue(indicator)}</b>
        <span className="market-change">
          {indicator.direction === "steady" ? null : <DirectionIcon aria-hidden="true" />}
          {indicator.direction === "steady" ? "변동 없음" : `${signedChange} · ${signedPercent}`}
        </span>
        <small className="market-updated">{indicator.updatedAt}</small>
      </span>
      <span className="market-chart-wrap"><MiniSparkline values={indicator.sparkline} direction={indicator.direction} /><small>MVP 예시</small></span>
    </button>
  );
}

export function MarketLinkCard({ indicator, onClick }: { indicator: MarketIndicator; onClick: () => void }) {
  const direction = indicator.direction === "down" ? "하락" : indicator.direction === "up" ? "상승" : "보합";
  return (
    <button className="market-link-card" data-direction={indicator.direction} onClick={onClick}>
      <span><strong>{indicator.name}</strong><small>{indicator.shortName} · {direction}</small></span>
      <span><b>{formatMarketValue(indicator)}</b><ArrowRight aria-hidden="true" /></span>
    </button>
  );
}

export function MarketLineChart({ values, direction }: { values: number[]; direction: MarketDirection }) {
  const color = direction === "down" ? "#2f80ed" : direction === "steady" ? "#8391a4" : "#ef665b";
  const points = linePoints(values, 320, 132, 12);
  return (
    <svg className="market-line-chart" viewBox="0 0 320 132" role="img" aria-label="선택 기간 시장 흐름 차트">
      {[28, 66, 104].map((y) => <line key={y} x1="10" y1={y} x2="310" y2={y} stroke="#e8eef5" strokeWidth="1" />)}
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MarketDataState({ state, onRetry }: { state: "loading" | "error" | "empty"; onRetry?: () => void }) {
  if (state === "loading") return <div className="market-data-state" role="status"><RefreshCw className="spin" aria-hidden="true" /><strong>시장 흐름을 정리하고 있어요</strong><p>잠시만 기다려 주세요.</p></div>;
  if (state === "error") return <div className="market-data-state" role="alert"><AlertCircle aria-hidden="true" /><strong>시장 데이터를 불러오지 못했어요</strong><p>잠시 후 다시 확인해 주세요.</p>{onRetry ? <button onClick={onRetry}>다시 시도</button> : null}</div>;
  return <div className="market-data-state"><Clock3 aria-hidden="true" /><strong>표시할 시장 지표가 없어요</strong><p>다른 카테고리를 선택해 보세요.</p></div>;
}
