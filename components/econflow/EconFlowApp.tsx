"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BellRing,
  BookCheck,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Crown,
  CalendarCheck2,
  Flame,
  GraduationCap,
  Heart,
  Info,
  Newspaper,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { issues, issueCategories } from "@/data/issues";
import { news } from "@/data/news";
import { lessons } from "@/data/lessons";
import { marketCategories, marketIndicators, marketSummary, type MarketCategory, type MarketPeriod } from "@/data/market";
import { quiz } from "@/data/quiz";
import {
  AppHeader,
  Badge,
  BottomNavigation,
  CategoryChip,
  Character,
  EconomicTermTooltip,
  EmptyState,
  FeaturedNewsCard,
  IssueCard,
  LearningCard,
  NewsCard,
  PrimaryButton,
  SectionHeader,
  type MainTab,
} from "./primitives";
import { MarketDataState, MarketIndicatorCard, MarketLineChart, MarketLinkCard, formatMarketValue } from "./market";
import { DailyStory, IssueHierarchy, MarketStrip, ResearchHub, StudyCategoryGrid, StudyMission } from "./dashboard";

export type EconFlowView = "home" | "issues" | "issue-detail" | "news" | "news-detail" | "study" | "lesson" | "research" | "market" | "market-detail" | "profile";

const tabToView: Record<MainTab, EconFlowView> = { home: "home", news: "news", study: "study", research: "research", market: "market", profile: "profile" };
const tabToPath: Record<MainTab, string> = { home: "/", news: "/news", study: "/study", research: "/research", market: "/market", profile: "/my" };

const studyCategories = ["추천", "기초", "시장", "기업", "투자전략"];
const newsDisplayCategories = ["전체", "경제정책", "주식", "글로벌", "산업", "환율"];
const marketViewCategories = [
  { id: "all", label: "전체" },
  { id: "kr-stock", label: "국내주식" },
  { id: "us-stock", label: "미국주식" },
  { id: "fx", label: "환율" },
  { id: "rate", label: "금리" },
  { id: "commodity", label: "원자재" },
] as const;
const marketPeriods: { id: MarketPeriod; label: string }[] = [
  { id: "1w", label: "1주" },
  { id: "1m", label: "1개월" },
  { id: "3m", label: "3개월" },
  { id: "1y", label: "1년" },
];

export default function EconFlowApp({ initialView = "home", initialId }: { initialView?: EconFlowView; initialId?: string }) {
  const router = useRouter();
  const [view, setView] = useState<EconFlowView>(initialView);
  const [issueId, setIssueId] = useState(initialView === "issue-detail" && initialId ? initialId : issues[0].id);
  const [newsId, setNewsId] = useState(initialView === "news-detail" && initialId ? initialId : news[0].id);
  const [lessonId, setLessonId] = useState(initialView === "lesson" && initialId ? initialId : lessons[0].id);
  const [marketId, setMarketId] = useState(initialView === "market-detail" && initialId ? initialId : marketIndicators[0].id);
  const [issueFilter, setIssueFilter] = useState("전체");
  const [newsFilter, setNewsFilter] = useState("전체");
  const [learningFilter, setLearningFilter] = useState("추천");
  const [marketFilter, setMarketFilter] = useState<"all" | "kr-stock" | "us-stock" | MarketCategory>("all");
  const [marketPeriod, setMarketPeriod] = useState<MarketPeriod>("1m");
  const [query, setQuery] = useState("");
  const [researchQuery, setResearchQuery] = useState("");
  const [savedNewsIds, setSavedNewsIds] = useState<Set<string>>(() => new Set());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [notice, setNotice] = useState("");
  const routeKey = `${initialView}:${initialId ?? ""}`;
  const [currentRouteKey, setCurrentRouteKey] = useState(routeKey);

  if (currentRouteKey !== routeKey) {
    setCurrentRouteKey(routeKey);
    setView(initialView);
    if (initialView === "issue-detail" && initialId) setIssueId(initialId);
    if (initialView === "news-detail" && initialId) setNewsId(initialId);
    if (initialView === "lesson" && initialId) setLessonId(initialId);
    if (initialView === "market-detail" && initialId) setMarketId(initialId);
  }

  const activeTab: MainTab = view === "news" || view === "news-detail" ? "news" : view === "study" || view === "lesson" ? "study" : view === "research" ? "research" : view === "market" || view === "market-detail" ? "market" : view === "profile" ? "profile" : "home";

  const go = (next: EconFlowView, path: string) => {
    setView(next);
    setNotice("");
    router.push(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setNotice("");
    router.back();
  };

  const navigateTab = (tab: MainTab) => {
    setView(tabToView[tab]);
    setNotice("");
    router.push(tabToPath[tab]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openIssue = (id: string) => { setIssueId(id); go("issue-detail", `/issues/${id}`); };
  const openNews = (id: string) => { setNewsId(id); go("news-detail", `/news/${id}`); };
  const openLesson = (id: string) => { setLessonId(id); go("lesson", `/study/${id}`); };
  const openMarket = (id: string) => { setMarketId(id); setMarketPeriod("1m"); go("market-detail", `/market/${id}`); };
  const toggleBookmark = (id: string) => setSavedNewsIds((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const filteredNews = useMemo(() => news.filter((item) => {
    const searchable = `${item.title} ${item.summary} ${item.category} ${item.keywords.join(" ")}`;
    const categoryMatch = newsFilter === "전체"
      || (newsFilter === "경제정책" && /금리|연준|물가|채권|한국은행/.test(searchable))
      || (newsFilter === "주식" && /주식|AI|반도체|테크/.test(searchable))
      || (newsFilter === "글로벌" && /글로벌|운임|미국/.test(searchable))
      || (newsFilter === "산업" && /산업|전력|데이터센터/.test(searchable))
      || (newsFilter === "환율" && /환율|달러|원화/.test(searchable));
    const searchMatch = !query.trim() || `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase());
    return categoryMatch && searchMatch;
  }), [newsFilter, query]);
  const filteredMarket = useMemo(() => marketIndicators.filter((item) => {
    if (marketFilter === "all") return true;
    if (marketFilter === "kr-stock") return item.category === "stock" && item.country === "KR";
    if (marketFilter === "us-stock") return item.category === "stock" && item.country === "US";
    return item.category === marketFilter;
  }), [marketFilter]);

  const renderHome = () => (
    <>
      <AppHeader title="EconFlow" action="home" onSearch={() => navigateTab("news")} onAction={() => setNotice("새로운 알림이 없어요. 오늘의 브리핑은 모두 확인할 수 있어요.")} />
      <div className="screen-content home-content">
        {notice ? <div className="inline-notice"><BellRing aria-hidden="true" />{notice}</div> : null}
        <section className="home-briefing">
          <div className="home-briefing-copy">
            <span className="today-label">2026년 9월 29일 · 화요일</span>
            <h1>서연님,<br />오늘도 좋은 하루예요! <span aria-hidden="true">👋</span></h1>
            <p>오늘 시장은 금리 인하 기대감으로<br />기술주 중심의 상승 흐름이에요.</p>
          </div>
          <Character pose="default" size="lg" />
        </section>

        <section className="section-block market-at-glance">
          <SectionHeader title="주요 지표" onAction={() => navigateTab("market")} />
          <MarketStrip indicators={["kospi", "kosdaq", "nasdaq", "usd-krw", "kr-base-rate"].map((id) => marketIndicators.find((item) => item.id === id)).filter((item): item is (typeof marketIndicators)[number] => Boolean(item))} onSelect={openMarket} />
        </section>

        <section className="section-block roomy">
          <SectionHeader title="오늘의 핵심 이슈" onAction={() => go("issues", "/issues")} />
          <IssueHierarchy items={issues.slice(0, 3)} onSelect={openIssue} />
        </section>

        <section className="section-block roomy">
          <DailyStory issue={issues[0]} onSelect={() => openIssue(issues[0].id)} />
        </section>

        <section className="section-block roomy">
          <SectionHeader title="지금 뜨는 경제 뉴스" onAction={() => navigateTab("news")} />
          <div className="news-list">
            {news.slice(0, 3).map((item) => <NewsCard key={item.id} item={item} compact bookmarked={savedNewsIds.has(item.id)} onBookmark={() => toggleBookmark(item.id)} onClick={() => openNews(item.id)} />)}
          </div>
        </section>

        <section className="section-block roomy">
          <SectionHeader kicker="하루 한 개념" title="오늘의 경제 공부" onAction={() => navigateTab("study")} />
          <StudyMission lesson={lessons[0]} onStart={() => openLesson(lessons[0].id)} />
        </section>
      </div>
    </>
  );

  const renderIssues = () => {
    const filtered = issueFilter === "전체" ? issues : issues.filter((item) => item.category === issueFilter);
    return (
      <>
        <AppHeader title="오늘의 핵심 이슈" onBack={back} />
        <div className="screen-content page-content">
          <div className="page-intro"><p className="eyebrow">3분 경제 브리핑</p><h1>오늘의 흐름을<br />한눈에 이해해요.</h1><p>꼭 필요한 맥락과 내 생활의 영향만 골라 정리했어요.</p></div>
          <div className="chip-scroller">{issueCategories.map((category) => <CategoryChip key={category} label={category} selected={issueFilter === category} onClick={() => setIssueFilter(category)} />)}</div>
          <div className="stack-list">{filtered.length ? filtered.map((issue) => <IssueCard key={issue.id} issue={issue} onClick={() => openIssue(issue.id)} />) : <EmptyState title="해당 이슈가 아직 없어요" description="다른 카테고리를 선택해 보세요." />}</div>
        </div>
      </>
    );
  };

  const renderIssueDetail = () => {
    const issue = issues.find((item) => item.id === issueId) ?? issues[0];
    const related = issue.relatedNewsIds.map((id) => news.find((item) => item.id === id)).filter(Boolean);
    const relatedMarkets = issue.relatedMarketIds.map((id) => marketIndicators.find((item) => item.id === id)).filter(Boolean);
    return (
      <>
        <AppHeader title="3분 만에 이해하기" onBack={back} />
        <article className="screen-content detail-page">
          <div className="detail-hero">
            <Badge tone="blue">{issue.category}</Badge>
            <p className="detail-overline">오늘의 핵심 이슈</p>
            <h1>{issue.title}</h1>
            <p>{issue.summary}</p>
            <div className="reading-time"><Clock3 aria-hidden="true" /> 약 3분 · {issue.publishedAt}</div>
          </div>

          <section className="explain-section"><span className="step-number">01</span><h2>무슨 일이 있었나요?</h2><p>{issue.event}</p></section>
          <section className="explain-section"><span className="step-number">02</span><h2>왜 이런 일이 생겼나요?</h2><p>{issue.cause}</p></section>
          <section className="explain-section"><span className="step-number">03</span><h2>그래서 나한테 어떤 영향이 있나요?</h2><div className="impact-grid three">{issue.impacts.slice(0, 3).map((impact) => <div className={`impact-card ${impact.tone}`} key={impact.label}><strong>{impact.label}</strong><p>{impact.text}</p></div>)}</div></section>
          <section className="explain-section remember-section"><span className="step-number">04</span><h2>이것만 기억하세요</h2><div className="summary-card"><Sparkles aria-hidden="true" /><div><span>한 줄 요약</span><strong>{issue.oneLine}</strong></div></div></section>
          <section className="explain-section"><span className="step-number">05</span><h2>모르는 단어가 있다면?</h2><div className="term-row"><EconomicTermTooltip term="기준금리" definition="중앙은행이 정하는 대표적인 금리로, 예금과 대출 등 여러 금리의 기준점이 돼요." /><EconomicTermTooltip term="연준" definition="미국의 중앙은행 역할을 하는 연방준비제도를 줄여 부르는 말이에요." /><EconomicTermTooltip term="인플레이션" definition="상품과 서비스의 전반적인 가격이 지속해서 오르는 현상이에요." /></div></section>
          <section className="explain-section"><span className="step-number">06</span><h2>같이 공부하면 좋아요</h2><section className="concept-cta"><div><span>이 뉴스가 어려웠다면?</span><h3>금리란 무엇일까?</h3><p>5분만 공부하면 뉴스가 훨씬 쉽게 읽혀요.</p></div><PrimaryButton onClick={() => openLesson("what-is-rate")}>5분 공부 시작 <ArrowRight aria-hidden="true" /></PrimaryButton></section></section>
          <section className="section-block roomy"><SectionHeader kicker="시장 연결" title="관련 시장 지표" /><div className="market-link-list">{relatedMarkets.map((indicator) => indicator ? <MarketLinkCard key={indicator.id} indicator={indicator} onClick={() => openMarket(indicator.id)} /> : null)}</div></section>
          <section className="section-block roomy"><SectionHeader kicker="07" title="관련 뉴스" /><div className="news-list">{related.map((item) => item ? <NewsCard key={item.id} item={item} compact onClick={() => openNews(item.id)} /> : null)}</div></section>
        </article>
      </>
    );
  };

  const renderNews = () => (
    <>
      <AppHeader title="뉴스" action="search" onAction={() => document.getElementById("news-search")?.focus()} />
      <div className="screen-content page-content news-page">
        <div className="page-intro compact"><p className="eyebrow">ECONOMY NOW</p><h1>오늘의 흐름을 읽는<br />경제 뉴스</h1><p>복잡한 소식도 핵심 맥락부터 쉽게 정리했어요.</p></div>
        <label className="search-field" htmlFor="news-search"><Search aria-hidden="true" /><input id="news-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="뉴스와 경제 키워드 검색" /></label>
        <div className="chip-scroller">{newsDisplayCategories.map((category) => <CategoryChip key={category} label={category} selected={newsFilter === category} onClick={() => setNewsFilter(category)} />)}</div>
        <div className="results-label"><span>오늘의 주요 뉴스 · {filteredNews.length}개</span><SlidersHorizontal aria-hidden="true" /></div>
        {filteredNews.length ? <><FeaturedNewsCard item={filteredNews[0]} bookmarked={savedNewsIds.has(filteredNews[0].id)} onBookmark={() => toggleBookmark(filteredNews[0].id)} onClick={() => openNews(filteredNews[0].id)} /><div className="news-list wide">{filteredNews.slice(1).map((item) => <NewsCard key={item.id} item={item} bookmarked={savedNewsIds.has(item.id)} onBookmark={() => toggleBookmark(item.id)} onClick={() => openNews(item.id)} />)}</div></> : <EmptyState title="검색 결과가 없어요" description="다른 키워드나 카테고리로 찾아보세요." />}
      </div>
    </>
  );

  const renderNewsDetail = () => {
    const item = news.find((entry) => entry.id === newsId) ?? news[0];
    const relatedLesson = lessons.find((lesson) => lesson.id === item.relatedLessonId) ?? lessons[0];
    const relatedMarkets = item.relatedMarketIds.map((id) => marketIndicators.find((indicator) => indicator.id === id)).filter(Boolean);
    return (
      <>
        <AppHeader title="뉴스 요약" onBack={back} />
        <article className="screen-content detail-page news-detail">
          <div className="news-detail-icon"><Newspaper aria-hidden="true" /></div>
          <div className="news-label-row"><Badge tone="blue">{item.category}</Badge><span className={`content-type-label ${item.contentType}`}>{item.contentType === "briefing" ? "BRIEFING" : "NEWS"}</span></div>
          <h1>{item.title}</h1>
          <div className="byline"><span>{item.source}</span><span>{item.publishedAt}</span></div>
          <section className="ai-summary"><div className="ai-summary-head"><Sparkles aria-hidden="true" /><strong>EconFlow 한눈 요약</strong></div><p>{item.summary}</p><ul><li>지표 하나보다 최근 흐름을 함께 확인해요.</li><li>발표와 실제 정책 결정 사이에는 시간이 걸릴 수 있어요.</li><li>내 생활에서는 금리, 환율, 소비 비용의 변화를 살펴보세요.</li></ul></section>
          <section className="context-card"><span>이 뉴스, 왜 중요할까요?</span><h2>시장의 기대가 먼저 움직이는 신호예요.</h2><p>경제 뉴스는 오늘의 숫자만 말하지 않아요. 앞으로의 정책과 기업 활동을 사람들이 어떻게 예상하는지도 보여줘요.</p></section>
          <div className="source-box"><div><strong>{item.contentType === "briefing" ? "EconFlow 설명 콘텐츠" : "원문 뉴스 출처"}</strong><span>{item.contentType === "briefing" ? "뉴스와 시장 데이터를 바탕으로 쉽게 풀어쓴 MVP 브리핑이에요." : `${item.source}에서 제공한 외부 뉴스예요.`}</span></div><button onClick={() => setNotice(item.contentType === "briefing" ? "브리핑은 외부 기사가 아니라 EconFlow의 설명 콘텐츠예요." : "원문 링크에서 언론사 기사를 확인할 수 있어요.")}>출처 안내 <ChevronRight aria-hidden="true" /></button></div>
          {notice ? <div className="inline-notice"><CheckCircle2 aria-hidden="true" />{notice}</div> : null}
          <section className="section-block roomy"><SectionHeader kicker="시장 연결" title="관련 시장 지표" /><div className="market-link-list">{relatedMarkets.map((indicator) => indicator ? <MarketLinkCard key={indicator.id} indicator={indicator} onClick={() => openMarket(indicator.id)} /> : null)}</div></section>
          <section className="section-block roomy"><SectionHeader kicker="관련 개념" title="뉴스를 더 잘 이해하려면" /><LearningCard lesson={relatedLesson} featured onClick={() => openLesson(relatedLesson.id)} /></section>
        </article>
      </>
    );
  };

  const renderMarket = () => (
    <>
      <AppHeader title="시장" action="info" onAction={() => setNotice("현재 시장 수치는 기능 확인을 위한 MVP 예시 데이터예요.")} />
      <div className="screen-content page-content market-page">
        {notice ? <div className="inline-notice"><Info aria-hidden="true" />{notice}</div> : null}
        <div className="market-title-row"><div><p className="eyebrow">MARKET FLOW</p><h1>글로벌 시장 한눈에</h1></div><span>10:20 기준</span></div>
        <div className="chip-scroller market-chips">{marketViewCategories.map((category) => <CategoryChip key={category.id} label={category.label} selected={marketFilter === category.id} onClick={() => setMarketFilter(category.id)} />)}</div>
        <section className="market-snapshot"><span>오늘의 시장 요약</span><strong>{marketSummary.headline}</strong><p>{marketSummary.description}</p></section>
        <section className="section-block market-indicators-section">
          <SectionHeader title="주요 지표" actionLabel="데이터 안내" onAction={() => setNotice("MVP에서는 핵심 10개 지표를 먼저 제공하고 있어요.")} />
          {filteredMarket.length ? <div className="market-indicator-grid">{filteredMarket.map((indicator) => <MarketIndicatorCard key={indicator.id} indicator={indicator} onClick={() => openMarket(indicator.id)} />)}</div> : <MarketDataState state="empty" />}
        </section>
      </div>
    </>
  );

  const renderMarketDetail = () => {
    const indicator = marketIndicators.find((item) => item.id === marketId) ?? marketIndicators[0];
    const relatedNews = indicator.relatedNewsIds.map((id) => news.find((item) => item.id === id)).filter(Boolean);
    const relatedLessons = indicator.relatedLessonIds.map((id) => lessons.find((lesson) => lesson.id === id)).filter(Boolean);
    const DirectionIcon = indicator.direction === "down" ? TrendingDown : TrendingUp;
    const changeText = indicator.direction === "steady" ? "변동 없음" : `${indicator.change > 0 ? "+" : ""}${indicator.change.toFixed(2)} · ${indicator.changePercent > 0 ? "+" : ""}${indicator.changePercent.toFixed(2)}%`;
    return (
      <>
        <AppHeader title="시장" onBack={back} />
        <article className="screen-content detail-page market-detail-page">
          <header className="market-detail-hero" data-direction={indicator.direction}>
            <Badge tone="blue">{marketCategories.find((category) => category.id === indicator.category)?.label}</Badge>
            <h1>{indicator.name}</h1>
            <strong>{formatMarketValue(indicator)}</strong>
            <span className="market-detail-change">{indicator.direction === "steady" ? null : <DirectionIcon aria-hidden="true" />}{changeText}</span>
            <small>{indicator.updatedAt} · MVP 예시 데이터</small>
          </header>
          <section className="market-chart-card">
            <div className="period-tabs" aria-label="차트 기간 선택">{marketPeriods.map((period) => <button key={period.id} className={marketPeriod === period.id ? "selected" : ""} onClick={() => setMarketPeriod(period.id)} aria-pressed={marketPeriod === period.id}>{period.label}</button>)}</div>
            <MarketLineChart values={indicator.history[marketPeriod]} direction={indicator.direction} />
          </section>
          <section className="market-explanation-card"><div><span>이게 무슨 뜻이에요?</span><h2>{indicator.name}을 쉽게 보면</h2><p>{indicator.simpleExplanation}</p></div><Character size="sm" pose="news" /></section>
          <section className="explain-section market-reasons"><span className="step-number">WHY</span><h2>왜 움직였어요?</h2><p>오늘 {indicator.name}에 영향을 준 요인을 쉬운 말로 정리했어요.</p><div className="reason-list">{indicator.marketReasons.map((reason, index) => <article key={reason.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{reason.title}</strong><p>{reason.description}</p></div></article>)}</div></section>
          <section className="section-block roomy"><SectionHeader title="관련 뉴스" /><div className="news-list">{relatedNews.map((item) => item ? <NewsCard key={item.id} item={item} compact onClick={() => openNews(item.id)} /> : null)}</div></section>
          <section className="section-block roomy"><SectionHeader kicker="이 개념이 어렵다면?" title="5분 경제 공부" /><div className="learning-stack">{relatedLessons.map((lesson) => lesson ? <LearningCard key={lesson.id} lesson={lesson} featured onClick={() => openLesson(lesson.id)} /> : null)}</div></section>
        </article>
      </>
    );
  };

  const studyLessons = learningFilter === "추천"
    ? lessons
    : learningFilter === "기초"
      ? lessons.filter((lesson) => lesson.difficulty === "기초")
      : learningFilter === "시장"
        ? lessons.filter((lesson) => ["금리", "환율", "경제지표"].includes(lesson.category))
        : learningFilter === "투자전략"
          ? lessons.filter((lesson) => lesson.category === "주식")
          : lessons.filter((lesson) => lesson.category === learningFilter);
  const renderStudy = () => (
    <>
      <AppHeader title="공부" action="search" onAction={() => setNotice("배우고 싶은 주제는 카테고리에서 빠르게 찾을 수 있어요.")} />
      <div className="screen-content page-content study-page">
        {notice ? <div className="inline-notice"><Info aria-hidden="true" />{notice}</div> : null}
        <section className="learning-stats">
          <div><Flame aria-hidden="true" /><span><strong>12일</strong><small>연속 학습</small></span></div>
          <div><ChartNoAxesCombined aria-hidden="true" /><span><strong>34%</strong><small>오늘 진행률</small></span></div>
          <div><BookCheck aria-hidden="true" /><span><strong>18개</strong><small>완료한 수업</small></span></div>
        </section>
        <StudyMission lesson={lessons[0]} onStart={() => openLesson(lessons[0].id)} />
        <div className="chip-scroller study-chips">{studyCategories.map((category) => <CategoryChip key={category} label={category} selected={learningFilter === category} onClick={() => setLearningFilter(category)} />)}</div>
        <section className="section-block roomy"><SectionHeader title="오늘 공부할 콘텐츠" /><LearningCard lesson={studyLessons[0] ?? lessons[0]} featured onClick={() => openLesson((studyLessons[0] ?? lessons[0]).id)} /></section>
        <section className="section-block roomy"><SectionHeader title="지금 많이 보는 강의" /><div className="popular-lessons">{studyLessons.slice(0, 3).map((lesson, index) => <button key={lesson.id} onClick={() => openLesson(lesson.id)}><span className="popular-rank">{index + 1}</span><span className="popular-lesson-icon"><BookOpen aria-hidden="true" /></span><strong>{lesson.title}</strong><small>{lesson.duration} · {lesson.category}</small></button>)}</div></section>
        <section className="section-block roomy"><SectionHeader title="카테고리로 배우기" /><StudyCategoryGrid onSelect={(category) => setNotice(`${category} 학습 콘텐츠를 모아볼 수 있어요.`)} /></section>
        <QuizSection selectedOption={selectedOption} setSelectedOption={(option) => { setSelectedOption(option); setShowAnswer(false); }} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />
        <section className="attendance-card"><CalendarCheck2 aria-hidden="true" /><div><strong>이번 주 4일 출석했어요</strong><p>내일도 이어서 13일 연속 학습에 도전해요.</p></div><Character size="sm" pose="cheer" /></section>
      </div>
    </>
  );

  const renderLesson = () => {
    const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
    return (
      <>
        <AppHeader title="경제 공부" onBack={back} />
        <article className="screen-content detail-page lesson-detail">
          <div className="lesson-cover"><div><Badge tone="blue">{lesson.category}</Badge><h1>{lesson.title}</h1><p>{lesson.description}</p><span><Clock3 aria-hidden="true" /> {lesson.duration} · {lesson.difficulty}</span></div><BookOpen aria-hidden="true" /></div>
          <div className="lesson-progress"><span style={{ width: "34%" }} /></div>
          {lesson.sections.map((section, index) => <section className="lesson-section" key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}
          <section className="takeaway-card"><BookCheck aria-hidden="true" /><div><h2>오늘 배운 핵심</h2><ul>{lesson.takeaways.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div></section>
          <section className="completion-card"><Character size="sm" pose="correct" /><div><span>여기까지 읽었어요!</span><strong>이제 뉴스 속 개념이 조금 더 선명해질 거예요.</strong></div><PrimaryButton onClick={() => navigateTab("study")}>다른 공부 보기</PrimaryButton></section>
        </article>
      </>
    );
  };

  const renderResearch = () => (
    <>
      <AppHeader title="리서치" action="bell" onAction={() => setNotice("새로 도착한 리서치 알림이 없어요.")} />
      <div className="screen-content page-content research-page">
        {notice ? <div className="inline-notice"><BellRing aria-hidden="true" />{notice}</div> : null}
        <ResearchHub query={researchQuery} onQuery={setResearchQuery} issues={issues} news={news} onOpenIssue={openIssue} onOpenNews={openNews} />
      </div>
    </>
  );

  const renderProfile = () => {
    const menu = [
      { icon: UserRound, title: "프로필", subtitle: "닉네임과 기본 정보를 확인해요" },
      { icon: Heart, title: "관심 주제", subtitle: "금리, 환율, AI 산업" },
      { icon: BookCheck, title: "학습 기록", subtitle: "이번 주 3개 개념을 읽었어요" },
      { icon: BellRing, title: "알림 설정", subtitle: "오늘의 브리핑 알림" },
      { icon: Settings, title: "이용 설정", subtitle: "글자 크기와 서비스 정보" },
      { icon: CircleHelp, title: "고객센터", subtitle: "궁금한 점을 편하게 물어보세요" },
    ];
    return (
      <>
        <AppHeader title="내 정보" action="settings" onAction={() => setNotice("이용 설정은 다음 MVP 단계에서 연결할 수 있어요.")} />
        <div className="screen-content page-content profile-page">
          <section className="profile-card"><Character size="md" pose="default" /><div><span>반가워요</span><h1>서연님</h1><p>경제를 알아가는 12일차예요!</p></div></section>
          <section className="streak-card"><div><Flame aria-hidden="true" /><strong>12일</strong><span>연속 학습</span></div><div><Crown aria-hidden="true" /><strong>327개</strong><span>퀴즈 정답</span></div><div><Star aria-hidden="true" /><strong>Lv.3</strong><span>나의 등급</span></div></section>
          <section className="cheer-banner"><Character size="sm" pose="cheer" /><div><strong>Flow가 응원해요!</strong><p>이번 주도 꾸준히 공부하고 있어요.<br />조금 더 하면 다음 레벨이에요.</p></div><ChevronRight aria-hidden="true" /></section>
          <div className="profile-list">{menu.map((item) => { const Icon = item.icon; return <button key={item.title} onClick={() => setNotice(`${item.title} 기능은 다음 MVP 단계에서 연결할 수 있어요.`)}><span className="profile-menu-icon"><Icon aria-hidden="true" /></span><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><ChevronRight aria-hidden="true" /></button>; })}</div>
          {notice ? <div className="inline-notice"><CheckCircle2 aria-hidden="true" />{notice}</div> : null}
          <p className="demo-label">EconFlow MVP · 데모 콘텐츠</p>
        </div>
      </>
    );
  };

  const current = view === "home" ? renderHome() : view === "issues" ? renderIssues() : view === "issue-detail" ? renderIssueDetail() : view === "news" ? renderNews() : view === "news-detail" ? renderNewsDetail() : view === "study" ? renderStudy() : view === "lesson" ? renderLesson() : view === "research" ? renderResearch() : view === "market" ? renderMarket() : view === "market-detail" ? renderMarketDetail() : renderProfile();

  return (
    <main className="app-canvas">
      <div className="phone-shell">
        {current}
        <BottomNavigation active={activeTab} onNavigate={navigateTab} />
      </div>
    </main>
  );
}

function QuizSection({ selectedOption, setSelectedOption, showAnswer, setShowAnswer }: { selectedOption: number | null; setSelectedOption: (option: number) => void; showAnswer: boolean; setShowAnswer: (show: boolean) => void }) {
  const isCorrect = selectedOption === quiz.answer;
  return (
    <section className="quiz-card">
      <div className="quiz-head">{showAnswer ? <span><GraduationCap aria-hidden="true" /></span> : <Character size="sm" pose="curious" />}<div><p>오늘의 퀴즈</p><h2>배운 내용을 확인해 볼까요?</h2></div></div>
      <p className="quiz-question">{quiz.question}</p>
      <div className="quiz-options">{quiz.options.map((option, index) => <button key={option} className={`${selectedOption === index ? "selected" : ""}${showAnswer && index === quiz.answer ? " correct" : ""}${showAnswer && selectedOption === index && index !== quiz.answer ? " wrong" : ""}`} onClick={() => setSelectedOption(index)}><span>{String.fromCharCode(65 + index)}</span>{option}{showAnswer && index === quiz.answer ? <Check aria-hidden="true" /> : null}</button>)}</div>
      {showAnswer && selectedOption !== null ? <div className={`quiz-result ${isCorrect ? "correct" : "retry"}`}><Character size="sm" pose={isCorrect ? "correct" : "curious"} /><span><strong>{isCorrect ? "정답이에요!" : "한 번 더 생각해 봐요."}</strong><p>{quiz.explanation}</p></span></div> : null}
      <PrimaryButton onClick={() => selectedOption !== null && setShowAnswer(true)} secondary={selectedOption === null}>정답 확인하기</PrimaryButton>
    </section>
  );
}
