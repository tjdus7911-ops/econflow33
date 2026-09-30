"use client";

import { useMemo, useRef, useState } from "react";
import {
  Bell,
  BellRing,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import {
  economicEvents,
  marketCalendarDays,
  marketIndicatorFilters,
  marketOverviewIndicators,
  marketThemes,
  marketTopCategories,
  watchlistUniverse,
  type EconomicEvent,
  type MarketIndicatorFilter,
  type MarketOverviewIndicator,
  type MarketTopCategory,
} from "@/data/market-overview";
import { marketSummary } from "@/data/market";
import { Character, SectionHeader } from "./primitives";
import { MiniSparkline } from "./market";
import { useMarketWatchlist } from "./useMarketWatchlist";

type WatchlistFilter = "all" | "KR" | "US";
type ThemeTab = "realtime" | "up" | "down";

const marketFilterMatch = (indicator: MarketOverviewIndicator, category: MarketTopCategory) => {
  if (category === "kr-stock") return indicator.market === "KR" && (indicator.category === "stock" || indicator.category === "etf");
  if (category === "us-stock") return indicator.market === "US" && (indicator.category === "stock" || indicator.category === "etf");
  return indicator.category === category;
};

const formatValue = (indicator: MarketOverviewIndicator) => {
  const digits = indicator.type === "POLICY_RATE" || indicator.type === "BOND" ? 2 : indicator.value < 100 ? 2 : 2;
  const value = indicator.value.toLocaleString("ko-KR", { maximumFractionDigits: digits, minimumFractionDigits: digits });
  if (indicator.unit === "원") return `${value}원`;
  if (indicator.unit === "달러") return `$${value}`;
  return `${value}${indicator.unit}`;
};

const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
const formatChange = (value: number) => `${value > 0 ? "+" : ""}${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}`;

const countryMeta: Record<EconomicEvent["country"], { flag: string; label: string }> = {
  KR: { flag: "🇰🇷", label: "한국" },
  US: { flag: "🇺🇸", label: "미국" },
  CN: { flag: "🇨🇳", label: "중국" },
  EU: { flag: "🇪🇺", label: "유럽" },
  JP: { flag: "🇯🇵", label: "일본" },
};

export function MarketExperience({
  notice,
  onNotice,
  onOpenIndicator,
}: {
  notice?: string;
  onNotice: (message: string) => void;
  onOpenIndicator: (id: string) => void;
}) {
  const [topCategory, setTopCategory] = useState<MarketTopCategory>("kr-stock");
  const [indicatorFilter, setIndicatorFilter] = useState<MarketIndicatorFilter>("all");
  const [watchlistFilter, setWatchlistFilter] = useState<WatchlistFilter>("all");
  const [selectedDate, setSelectedDate] = useState("2026-09-30");
  const [themeTab, setThemeTab] = useState<ThemeTab>("realtime");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [carouselPage, setCarouselPage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const watchlist = useMarketWatchlist();

  const carouselIndicators = useMemo(() => {
    const filtered = marketOverviewIndicators.filter((indicator) => marketFilterMatch(indicator, topCategory));
    return filtered.length ? filtered : marketOverviewIndicators;
  }, [topCategory]);

  const filteredIndicators = useMemo(() => marketOverviewIndicators.filter((indicator) =>
    indicatorFilter === "all" || indicator.category === indicatorFilter), [indicatorFilter]);

  const watchlistItems = watchlist.items.filter((item) => watchlistFilter === "all" || item.market === watchlistFilter);
  const selectedEvents = economicEvents.filter((event) => event.date === selectedDate);
  const visibleThemes = marketThemes.filter((theme) => theme.tab === themeTab);
  const searchResults = watchlistUniverse.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    return !query || `${item.name} ${item.symbol}`.toLowerCase().includes(query);
  });
  const pageCount = Math.max(1, Math.ceil(carouselIndicators.length / 3));

  const selectTopCategory = (category: MarketTopCategory) => {
    setTopCategory(category);
    setCarouselPage(0);
    carouselRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const updateCarouselPage = () => {
    const carousel = carouselRef.current;
    if (!carousel || pageCount === 1) return;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const page = maxScroll > 0 ? Math.round((carousel.scrollLeft / maxScroll) * (pageCount - 1)) : 0;
    setCarouselPage(Math.min(pageCount - 1, Math.max(0, page)));
  };

  const goToCarouselPage = (page: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    carousel.scrollTo({ left: pageCount > 1 ? maxScroll * (page / (pageCount - 1)) : 0, behavior: "smooth" });
    setCarouselPage(page);
  };

  const selectIndicator = (indicator: MarketOverviewIndicator) => {
    if (indicator.detailId) onOpenIndicator(indicator.detailId);
    else onNotice(`${indicator.name} 상세 화면은 실제 데이터 연동 단계에서 제공할 예정이에요.`);
  };

  return (
    <div className="screen-content page-content market-hub-page">
      {notice ? <div className="inline-notice"><BellRing aria-hidden="true" />{notice}</div> : null}

      <nav className="market-hub-categories" aria-label="시장 카테고리">
        {marketTopCategories.map((category) => (
          <button
            type="button"
            key={category.id}
            className={topCategory === category.id ? "selected" : ""}
            aria-pressed={topCategory === category.id}
            onClick={() => selectTopCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <section className="market-hub-section market-hub-summary-section">
        <SectionHeader title="시장 요약" onAction={() => onNotice("시장 지표는 현재 MVP 예시 데이터로 구성되어 있어요.")} />
        <article className="market-hub-summary">
          <div>
            <span>오늘의 시장 한눈에 보기</span>
            <strong>{marketSummary.headline}</strong>
            <p>{marketSummary.description}</p>
            <small>업데이트 {marketSummary.updatedAt} · MVP 예시 데이터</small>
          </div>
          <Character pose="market" size="lg" alt="시장 흐름을 살펴보는 돈똑이" />
        </article>
      </section>

      <section className="market-hub-carousel-section" aria-label="대표 시장 지표">
        <div className="market-hub-carousel" ref={carouselRef} onScroll={updateCarouselPage}>
          {carouselIndicators.map((indicator) => (
            <button type="button" className="market-hub-carousel-card" data-direction={indicator.direction} key={indicator.id} onClick={() => selectIndicator(indicator)}>
              <span className="market-hub-card-name">{indicator.shortName}</span>
              <strong>{formatValue(indicator)}</strong>
              <em>{formatPercent(indicator.changePercent)}</em>
              <MiniSparkline values={indicator.chartData} direction={indicator.direction} />
            </button>
          ))}
        </div>
        <div className="market-hub-carousel-dots" aria-label={`지표 ${carouselPage + 1}/${pageCount} 페이지`}>
          {Array.from({ length: pageCount }, (_, index) => (
            <button type="button" key={index} className={carouselPage === index ? "selected" : ""} onClick={() => goToCarouselPage(index)} aria-label={`${index + 1}번째 지표 페이지`} />
          ))}
        </div>
      </section>

      <section className="market-hub-section">
        <SectionHeader title="주요 지수" onAction={() => setIndicatorFilter("all")} />
        <div className="market-hub-filter-scroll" role="tablist" aria-label="주요 지수 필터">
          {marketIndicatorFilters.map((filter) => (
            <button type="button" role="tab" key={filter.id} aria-selected={indicatorFilter === filter.id} className={indicatorFilter === filter.id ? "selected" : ""} onClick={() => setIndicatorFilter(filter.id)}>
              {filter.label}
            </button>
          ))}
        </div>
        <div className="market-hub-indicator-grid">
          {filteredIndicators.map((indicator) => (
            <button type="button" className="market-hub-indicator" data-direction={indicator.direction} key={indicator.id} onClick={() => selectIndicator(indicator)}>
              <span className="market-hub-indicator-head">
                <span>{indicator.name}</span>
                <small>{indicator.type === "ETF" ? "ETF" : indicator.market}</small>
              </span>
              <strong>{formatValue(indicator)}</strong>
              <span className="market-hub-indicator-foot">
                <em>{formatPercent(indicator.changePercent)}</em>
                <MiniSparkline values={indicator.chartData} direction={indicator.direction} />
              </span>
            </button>
          ))}
        </div>
        <p className="market-hub-data-note">※ 주요 지수 수치는 화면 확인용 MVP 예시 데이터입니다.</p>
      </section>

      <section className="market-hub-section market-watchlist-section">
        <SectionHeader title="관심 종목" onAction={() => setSheetOpen(true)} />
        <div className="market-watchlist-toolbar">
          <div role="tablist" aria-label="관심 종목 시장 필터">
            {([{"id":"all","label":"전체"},{"id":"KR","label":"국내"},{"id":"US","label":"해외"}] as const).map((filter) => (
              <button type="button" role="tab" aria-selected={watchlistFilter === filter.id} className={watchlistFilter === filter.id ? "selected" : ""} key={filter.id} onClick={() => setWatchlistFilter(filter.id)}>{filter.label}</button>
            ))}
          </div>
          <button type="button" className="market-watchlist-add" onClick={() => setSheetOpen(true)}><Plus aria-hidden="true" /> 종목 추가</button>
        </div>

        {watchlistItems.length ? (
          <div className="market-watchlist-list">
            {watchlistItems.map((item) => (
              <article className="market-watchlist-row" data-direction={item.change >= 0 ? "up" : "down"} key={item.id}>
                <span className="market-watchlist-symbol">{item.name.slice(0, 1)}</span>
                <span className="market-watchlist-name"><strong>{item.name}</strong><small>{item.symbol} · {item.market === "KR" ? "국내" : "미국"}{item.type === "ETF" ? " ETF" : ""}</small></span>
                <span className="market-watchlist-value"><strong>{item.market === "KR" ? `${item.value.toLocaleString("ko-KR")}원` : `$${item.value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}`}</strong><small>{formatChange(item.change)} · {formatPercent(item.changePercent)}</small></span>
                <MiniSparkline values={item.chartData} direction={item.change >= 0 ? "up" : "down"} />
                <button type="button" className={item.alertEnabled ? "active" : ""} onClick={() => watchlist.toggleAlert(item.id)} aria-label={`${item.name} 알림 ${item.alertEnabled ? "끄기" : "켜기"}`}><Bell aria-hidden="true" /></button>
                <button type="button" onClick={() => watchlist.remove(item.id)} aria-label={`${item.name} 관심 종목에서 삭제`}><Trash2 aria-hidden="true" /></button>
              </article>
            ))}
          </div>
        ) : (
          <div className="market-watchlist-empty">
            <div><strong>관심 종목을 추가해보세요</strong><p>내가 관심 있는 종목의 예시 시세를<br />한눈에 확인할 수 있어요.</p><button type="button" onClick={() => setSheetOpen(true)}><Plus aria-hidden="true" /> 관심 종목 추가</button></div>
            <Character pose="money" size="lg" alt="관심 종목을 안내하는 돈똑이" />
          </div>
        )}
      </section>

      <section className="market-hub-section market-calendar-section">
        <SectionHeader title="증시 캘린더" onAction={() => onNotice("선택한 날짜의 주요 경제 일정을 확인할 수 있어요.")} />
        <div className="market-calendar-week" role="tablist" aria-label="날짜 선택">
          {marketCalendarDays.map((day) => {
            const hasEvents = economicEvents.some((event) => event.date === day.date);
            return (
              <button type="button" role="tab" aria-selected={selectedDate === day.date} className={selectedDate === day.date ? "selected" : ""} key={day.date} onClick={() => setSelectedDate(day.date)}>
                <span>{day.day}</span><strong>{day.dateLabel}</strong>{hasEvents ? <i aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
        <div className="market-calendar-date"><CalendarDays aria-hidden="true" /><strong>{selectedDate.replace("2026-", "").replace("-", "월 ")}일 일정</strong><small>MVP 예시</small></div>
        {selectedEvents.length ? (
          <div className="market-calendar-events">
            {selectedEvents.map((event) => {
              const country = countryMeta[event.country];
              return (
                <article key={event.id} className="market-calendar-event">
                  <span className="market-event-country" aria-label={country.label}>{country.flag}</span>
                  <time>{event.time}</time>
                  <div><strong>{event.title}</strong>{event.forecast || event.previous ? <small>예상 {event.forecast ?? "-"} · 이전 {event.previous ?? "-"}</small> : null}</div>
                  <span className={`market-event-importance ${event.importance}`} aria-label={`중요도 ${event.importance}`}>{event.importance === "high" ? "★" : event.importance === "medium" ? "●" : "·"}</span>
                </article>
              );
            })}
          </div>
        ) : <div className="market-calendar-empty"><Clock3 aria-hidden="true" /><span>등록된 주요 일정이 없어요.</span></div>}
      </section>

      <section className="market-hub-section market-theme-section">
        <SectionHeader title="오늘의 테마" onAction={() => onNotice("테마 정보는 화면 확인용 MVP 예시 데이터예요.")} />
        <div className="market-theme-tabs" role="tablist" aria-label="오늘의 테마 필터">
          {([{"id":"realtime","label":"실시간 이슈"},{"id":"up","label":"상승 테마"},{"id":"down","label":"하락 테마"}] as const).map((tab) => (
            <button type="button" role="tab" aria-selected={themeTab === tab.id} className={themeTab === tab.id ? "selected" : ""} key={tab.id} onClick={() => setThemeTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
        <div className="market-theme-rank-list">
          {visibleThemes.map((theme) => {
            const DirectionIcon = theme.changePercent < 0 ? TrendingDown : TrendingUp;
            return (
              <button type="button" data-direction={theme.changePercent < 0 ? "down" : "up"} key={theme.id} onClick={() => onNotice(`${theme.name} 관련 소식은 뉴스 탭에서 이어서 확인할 수 있어요.`)}>
                <span>{theme.rank}</span><strong>{theme.name}</strong><small>{theme.keywords.join(" · ")}</small><em><DirectionIcon aria-hidden="true" /> {formatPercent(theme.changePercent)}</em><ChevronRight aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>

      {sheetOpen ? (
        <div className="market-sheet-layer" role="presentation" onMouseDown={() => setSheetOpen(false)}>
          <section className="market-watchlist-sheet" role="dialog" aria-modal="true" aria-labelledby="watchlist-sheet-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="market-sheet-handle" aria-hidden="true" />
            <header><div><span>관심 종목</span><h2 id="watchlist-sheet-title">종목 검색 및 추가</h2></div><button type="button" onClick={() => setSheetOpen(false)} aria-label="닫기"><X aria-hidden="true" /></button></header>
            <label className="market-sheet-search"><Search aria-hidden="true" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="종목명 또는 종목코드 검색" /></label>
            <p className="market-sheet-note">화면 확인용 예시 종목입니다. 추가한 종목은 이 브라우저에 저장돼요.</p>
            <div className="market-sheet-results">
              {searchResults.map((item) => {
                const saved = watchlist.isSaved(item.id);
                return (
                  <article key={item.id}>
                    <span>{item.name.slice(0, 1)}</span><div><strong>{item.name}</strong><small>{item.symbol} · {item.market === "KR" ? "국내" : "미국"}{item.type === "ETF" ? " ETF" : ""}</small></div>
                    <button type="button" className={saved ? "saved" : ""} onClick={() => saved ? watchlist.remove(item.id) : watchlist.add(item.id)}>{saved ? <><Check aria-hidden="true" /> 추가됨</> : <><Plus aria-hidden="true" /> 추가</>}</button>
                  </article>
                );
              })}
              {!searchResults.length ? <div className="market-sheet-no-results"><CircleDollarSign aria-hidden="true" /><span>검색 결과가 없어요.</span></div> : null}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
