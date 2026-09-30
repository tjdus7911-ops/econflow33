"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BellRing, CalendarDays, Check, CheckCircle2, ChevronRight, CircleDollarSign, Plus, Search, X } from "lucide-react";
import {
  economicEvents,
  keyAssetIds,
  marketCalendarDays,
  marketDailyBrief,
  marketIndicatorFilters,
  marketOverviewIndicators,
  marketThemes,
  marketTopCategories,
  watchlistUniverse,
  type EconomicEvent,
  type MarketIndicatorFilter,
  type MarketOverviewIndicator,
  type MarketTopCategory,
  type MarketTheme,
  type WatchlistItem,
} from "@/data/market-overview";
import { Character, SectionHeader } from "./primitives";
import { MiniSparkline } from "./market";
import { useMarketWatchlist } from "./useMarketWatchlist";

type GlobalRegion = "US" | "CN" | "EU" | "JP";
type RateBondTab = "rate" | "kr-bond" | "us-bond";

const countryFlag: Record<MarketOverviewIndicator["market"], string> = {
  KR: "🇰🇷", US: "🇺🇸", JP: "🇯🇵", CN: "🇨🇳", EU: "🇪🇺", GLOBAL: "🌐",
};

const eventCountry: Record<EconomicEvent["country"], { flag: string; label: string }> = {
  KR: { flag: "🇰🇷", label: "한국" }, US: { flag: "🇺🇸", label: "미국" }, CN: { flag: "🇨🇳", label: "중국" }, EU: { flag: "🇪🇺", label: "유럽" }, JP: { flag: "🇯🇵", label: "일본" },
};

const formatValue = (indicator: MarketOverviewIndicator) => {
  const integerWon = indicator.unit === "원" && Number.isInteger(indicator.value);
  const value = indicator.value.toLocaleString("ko-KR", { maximumFractionDigits: integerWon ? 0 : 2, minimumFractionDigits: integerWon ? 0 : 2 });
  if (indicator.unit === "원") return `${value}원`;
  if (indicator.unit === "달러") return `$${value}`;
  return `${value}${indicator.unit}`;
};

const formatWatchlistValue = (item: WatchlistItem) => item.market === "KR"
  ? item.value.toLocaleString("ko-KR")
  : item.value.toLocaleString("ko-KR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

function MarketSummary({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" className="market-final-summary" onClick={onOpen}>
      <span className="market-final-summary-copy">
        <span className="market-final-summary-kicker">오늘의 시장 한눈에 보기 <ChevronRight aria-hidden="true" /></span>
        <strong>{marketDailyBrief.title}</strong>
        <span className="market-final-reasons">
          {marketDailyBrief.reasons.map((reason) => <small key={reason}><CheckCircle2 aria-hidden="true" />{reason}</small>)}
        </span>
        <em>{marketDailyBrief.updatedAt} · MVP 예시 데이터</em>
      </span>
      <Character pose="market" size="lg" alt="오늘의 시장을 설명하는 돈똑이" />
    </button>
  );
}

function KeyAssetCarousel({ onSelect }: { onSelect: (indicator: MarketOverviewIndicator) => void }) {
  const assets = keyAssetIds.flatMap((id) => {
    const indicator = marketOverviewIndicators.find((item) => item.id === id);
    return indicator ? [indicator] : [];
  });
  return (
    <section className="market-final-section">
      <SectionHeader title="주요 자산" onAction={() => onSelect(assets[0])} />
      <div className="market-final-asset-strip">
        {assets.map((indicator) => (
          <button type="button" key={indicator.id} data-direction={indicator.direction} onClick={() => onSelect(indicator)}>
            <span>{countryFlag[indicator.market]} {indicator.shortName.replace(" (ETF)", "")}</span>
            <strong>{formatValue(indicator)}</strong>
            <em>{formatPercent(indicator.changePercent)}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

function MarketIndicatorTabs({ selected, onChange }: { selected: MarketIndicatorFilter; onChange: (filter: MarketIndicatorFilter) => void }) {
  return (
    <div className="market-final-segmented" role="tablist" aria-label="주요 지표 필터">
      {marketIndicatorFilters.map((filter) => <button type="button" role="tab" key={filter.id} className={selected === filter.id ? "selected" : ""} aria-selected={selected === filter.id} onClick={() => onChange(filter.id)}>{filter.label}</button>)}
    </div>
  );
}

function MarketIndicatorList({ indicators, onSelect }: { indicators: MarketOverviewIndicator[]; onSelect: (indicator: MarketOverviewIndicator) => void }) {
  return (
    <div className="market-final-indicator-list">
      {indicators.map((indicator) => (
        <button type="button" key={indicator.id} data-direction={indicator.direction} onClick={() => onSelect(indicator)}>
          <span className="market-final-row-name"><i aria-hidden="true">{countryFlag[indicator.market]}</i><strong>{indicator.type === "ETF" ? indicator.shortName : indicator.name}</strong></span>
          <b>{formatValue(indicator)}</b><em>{formatPercent(indicator.changePercent)}</em><MiniSparkline values={indicator.chartData} direction={indicator.direction} /><ChevronRight aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function WatchlistCarousel({ items, onAdd, onRemove }: { items: WatchlistItem[]; onAdd: () => void; onRemove: (id: string) => void }) {
  if (!items.length) {
    return <div className="market-final-watchlist-empty"><span><strong>관심 종목을 추가해보세요</strong><small>내 종목의 흐름을 가로로 빠르게 확인할 수 있어요.</small></span><button type="button" onClick={onAdd}><Plus aria-hidden="true" /> 종목 추가</button></div>;
  }
  return (
    <div className="market-final-watchlist-strip">
      {items.map((item) => {
        const direction = item.changePercent < 0 ? "down" : item.changePercent > 0 ? "up" : "steady";
        return (
          <article key={item.id} data-direction={direction}>
            <button type="button" className="market-final-watchlist-remove" onClick={() => onRemove(item.id)} aria-label={`${item.name} 관심 종목에서 삭제`}><X aria-hidden="true" /></button>
            <span className="market-final-stock-symbol">{item.symbol.slice(0, 2)}</span><strong>{item.symbol.length <= 5 && item.market === "US" ? item.symbol : item.name}</strong><small>{item.symbol}</small><b>{formatWatchlistValue(item)}</b><em>{formatPercent(item.changePercent)}</em><MiniSparkline values={item.chartData} direction={direction} />
          </article>
        );
      })}
      <button type="button" className="market-final-watchlist-more" onClick={onAdd} aria-label="관심 종목 추가"><Plus aria-hidden="true" /><span>추가</span></button>
    </div>
  );
}

function EconomicCalendarPreview({ selectedDate, onSelect }: { selectedDate: string; onSelect: (date: string) => void }) {
  const events = economicEvents.filter((event) => event.date === selectedDate).slice(0, 2);
  return (
    <>
      <div className="market-final-calendar" role="tablist" aria-label="증시 캘린더 날짜 선택">
        {marketCalendarDays.map((day) => {
          const hasEvents = economicEvents.some((event) => event.date === day.date);
          return <button type="button" role="tab" key={day.date} className={selectedDate === day.date ? "selected" : ""} aria-selected={selectedDate === day.date} onClick={() => onSelect(day.date)}><span>{day.dateLabel}</span><strong>{day.day}</strong>{hasEvents ? <i aria-hidden="true" /> : null}</button>;
        })}
      </div>
      <div className="market-final-event-preview">
        {events.length ? events.map((event) => {
          const country = eventCountry[event.country];
          return <article key={event.id}><span aria-label={country.label}>{country.flag}</span><time>{event.time}</time><strong>{event.title}</strong><em>{event.importance === "high" ? "중요" : "일정"}</em><ChevronRight aria-hidden="true" /></article>;
        }) : <div><CalendarDays aria-hidden="true" />선택한 날짜의 주요 일정이 없어요.</div>}
      </div>
    </>
  );
}

function MarketThemeCarousel({ themes, onSelect }: { themes: MarketTheme[]; onSelect: (theme: MarketTheme) => void }) {
  return (
    <div className="market-final-theme-strip">
      {themes.map((theme) => (
        <button type="button" key={theme.id} data-direction={theme.direction} onClick={() => onSelect(theme)}>
          <Image src={theme.image} alt="" fill sizes="120px" />
          <span className="market-final-theme-rank">{theme.rank}</span><span className="market-final-theme-copy"><strong>{theme.name}</strong><em>{formatPercent(theme.changePercent)}</em></span>
        </button>
      ))}
    </div>
  );
}

function MetricCardStrip({ indicators, onSelect }: { indicators: MarketOverviewIndicator[]; onSelect: (indicator: MarketOverviewIndicator) => void }) {
  return <div className="market-final-metric-strip">{indicators.map((indicator) => <button type="button" key={indicator.id} data-direction={indicator.direction} onClick={() => onSelect(indicator)}><span>{indicator.shortName}</span><strong>{formatValue(indicator)}</strong><em>{formatPercent(indicator.changePercent)}</em><MiniSparkline values={indicator.chartData} direction={indicator.direction} /></button>)}</div>;
}

function AdditionalMarketSections({ onSelect, onNotice }: { onSelect: (indicator: MarketOverviewIndicator) => void; onNotice: (message: string) => void }) {
  const [globalRegion, setGlobalRegion] = useState<GlobalRegion>("US");
  const [rateBondTab, setRateBondTab] = useState<RateBondTab>("rate");
  const globalIndices = marketOverviewIndicators.filter((item) => item.category === "stock" && item.market === globalRegion).slice(0, 4);
  const fx = marketOverviewIndicators.filter((item) => item.category === "fx").slice(0, 4);
  const rateBond = marketOverviewIndicators.filter((item) => rateBondTab === "rate" ? item.category === "rate" : item.category === "bond" && item.market === (rateBondTab === "kr-bond" ? "KR" : "US")).slice(0, 4);
  const commodities = marketOverviewIndicators.filter((item) => item.category === "commodity").slice(0, 4);
  return (
    <div className="market-final-extra">
      <section className="market-final-section">
        <SectionHeader title="글로벌 지수" onAction={() => onNotice("글로벌 지수는 MVP 예시 데이터로 제공하고 있어요.")} />
        <div className="market-final-segmented four" role="tablist" aria-label="글로벌 지수 지역">
          {([{"id":"US","label":"미국"},{"id":"CN","label":"중국"},{"id":"EU","label":"유럽"},{"id":"JP","label":"아시아"}] as const).map((region) => <button type="button" role="tab" key={region.id} className={globalRegion === region.id ? "selected" : ""} aria-selected={globalRegion === region.id} onClick={() => setGlobalRegion(region.id)}>{region.label}</button>)}
        </div>
        {globalIndices.length ? <MarketIndicatorList indicators={globalIndices} onSelect={onSelect} /> : <p className="market-final-no-data">해당 지역 지표는 데이터 연결을 준비 중이에요.</p>}
      </section>
      <section className="market-final-section"><SectionHeader title="환율" onAction={() => onNotice("환율 전체보기는 준비 중이에요.")} /><MetricCardStrip indicators={fx} onSelect={onSelect} /></section>
      <section className="market-final-section">
        <SectionHeader title="금리 · 채권" onAction={() => onNotice("금리·채권 전체보기는 준비 중이에요.")} />
        <div className="market-final-segmented three" role="tablist" aria-label="금리와 채권 구분">
          {([{"id":"rate","label":"기준금리"},{"id":"kr-bond","label":"한국 국채"},{"id":"us-bond","label":"미국 국채"}] as const).map((tab) => <button type="button" role="tab" key={tab.id} className={rateBondTab === tab.id ? "selected" : ""} aria-selected={rateBondTab === tab.id} onClick={() => setRateBondTab(tab.id)}>{tab.label}</button>)}
        </div>
        <MetricCardStrip indicators={rateBond} onSelect={onSelect} />
      </section>
      <section className="market-final-section"><SectionHeader title="원자재" onAction={() => onNotice("원자재 전체보기는 준비 중이에요.")} /><MetricCardStrip indicators={commodities} onSelect={onSelect} /></section>
      <p className="market-final-data-note">시장 화면의 수치는 화면 검증용 MVP 예시 데이터이며 실시간 시세가 아닙니다.</p>
    </div>
  );
}

export function MarketExperience({ notice, onNotice, onOpenIndicator }: { notice?: string; onNotice: (message: string) => void; onOpenIndicator: (id: string) => void }) {
  const [topCategory, setTopCategory] = useState<MarketTopCategory>("all");
  const [indicatorFilter, setIndicatorFilter] = useState<MarketIndicatorFilter>("stock");
  const [indicatorExpanded, setIndicatorExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-09-30");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const watchlist = useMarketWatchlist();

  const filteredIndicators = useMemo(() => marketOverviewIndicators.filter((indicator) => {
    if (indicator.category !== indicatorFilter) return false;
    if (topCategory === "kr-stock") return indicator.market === "KR";
    if (topCategory === "us-stock") return indicator.market === "US";
    return true;
  }), [indicatorFilter, topCategory]);
  const visibleIndicators = indicatorExpanded ? filteredIndicators : filteredIndicators.slice(0, 6);
  const searchResults = watchlistUniverse.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    return !query || `${item.name} ${item.symbol}`.toLowerCase().includes(query);
  });

  const selectTopCategory = (category: MarketTopCategory) => {
    setTopCategory(category);
    setIndicatorExpanded(false);
    if (category === "fx" || category === "rate" || category === "bond" || category === "commodity") setIndicatorFilter(category);
    else setIndicatorFilter("stock");
  };
  const selectIndicator = (indicator: MarketOverviewIndicator) => {
    if (indicator.detailId) onOpenIndicator(indicator.detailId);
    else onNotice(`${indicator.name} 상세 화면은 실제 데이터 연동 단계에서 제공할 예정이에요.`);
  };

  return (
    <div className="screen-content page-content market-hub-page market-final-page">
      {notice ? <div className="inline-notice"><BellRing aria-hidden="true" />{notice}</div> : null}
      <nav className="market-hub-categories" aria-label="시장 카테고리">{marketTopCategories.map((category) => <button type="button" key={category.id} className={topCategory === category.id ? "selected" : ""} aria-pressed={topCategory === category.id} onClick={() => selectTopCategory(category.id)}>{category.label}</button>)}</nav>
      <MarketSummary onOpen={() => onNotice("오늘 시장의 핵심 이유 3가지를 요약했어요.")} />
      <KeyAssetCarousel onSelect={selectIndicator} />

      <section className="market-final-section market-final-indicators-section">
        <SectionHeader title="주요 지표" actionLabel={indicatorExpanded ? "접기" : "전체보기"} onAction={() => setIndicatorExpanded((current) => !current)} />
        <MarketIndicatorTabs selected={indicatorFilter} onChange={(filter) => { setIndicatorFilter(filter); setIndicatorExpanded(false); }} />
        <MarketIndicatorList indicators={visibleIndicators} onSelect={selectIndicator} />
      </section>

      <section className="market-final-section">
        <div className="market-final-heading-row"><SectionHeader title="관심 종목" onAction={() => setSheetOpen(true)} /><button type="button" onClick={() => setSheetOpen(true)}><Plus aria-hidden="true" /> 종목 추가</button></div>
        <WatchlistCarousel items={watchlist.items} onAdd={() => setSheetOpen(true)} onRemove={watchlist.remove} />
      </section>

      <section className="market-final-section"><SectionHeader title="증시 캘린더" onAction={() => onNotice("전체 경제 일정 화면은 준비 중이에요.")} /><EconomicCalendarPreview selectedDate={selectedDate} onSelect={setSelectedDate} /></section>
      <section className="market-final-section"><SectionHeader title="오늘의 테마" onAction={() => onNotice("테마 전체보기는 준비 중이에요.")} /><MarketThemeCarousel themes={marketThemes.filter((theme) => theme.tab === "realtime")} onSelect={(theme) => onNotice(`${theme.name} 관련 소식은 뉴스 탭에서 이어서 확인할 수 있어요.`)} /></section>
      <AdditionalMarketSections onSelect={selectIndicator} onNotice={onNotice} />

      {sheetOpen ? (
        <div className="market-sheet-layer" role="presentation" onMouseDown={() => setSheetOpen(false)}>
          <section className="market-watchlist-sheet" role="dialog" aria-modal="true" aria-labelledby="watchlist-sheet-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="market-sheet-handle" aria-hidden="true" />
            <header><div><span>관심 종목</span><h2 id="watchlist-sheet-title">종목 검색 및 추가</h2></div><button type="button" onClick={() => setSheetOpen(false)} aria-label="닫기"><X aria-hidden="true" /></button></header>
            <label className="market-sheet-search"><Search aria-hidden="true" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="종목명 또는 티커를 검색해보세요" /></label>
            <p className="market-sheet-note">화면 확인용 예시 종목입니다. 추가한 종목은 이 브라우저에 저장돼요.</p>
            <div className="market-sheet-results">
              {searchResults.map((item) => {
                const saved = watchlist.isSaved(item.id);
                return <article key={item.id}><span>{item.symbol.slice(0, 2)}</span><div><strong>{item.name}</strong><small>{item.symbol} · {item.market === "KR" ? "국내주식" : item.type === "ETF" ? "미국 ETF" : "미국주식"}</small></div><button type="button" className={saved ? "saved" : ""} onClick={() => saved ? watchlist.remove(item.id) : watchlist.add(item.id)}>{saved ? <><Check aria-hidden="true" /> 관심</> : <><Plus aria-hidden="true" /> 추가</>}</button></article>;
              })}
              {!searchResults.length ? <div className="market-sheet-no-results"><CircleDollarSign aria-hidden="true" /><span>검색 결과가 없어요.</span></div> : null}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
