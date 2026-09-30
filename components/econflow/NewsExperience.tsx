"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Brain,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  Flag,
  Heart,
  MessageCircle,
  Minus,
  Search,
  Send,
  Share2,
  Sparkles,
  ThumbsUp,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { NewsItem, NewsRelatedIndicator } from "@/lib/news/types";
import {
  NEWS_FEED_CATEGORIES,
  buildNewsAiContent,
  formatCompactCount,
  formatNewsDate,
  formatNewsDateTime,
  formatNewsTime,
  getNewsFeedCategory,
  getNewsMetrics,
  getRelatedCompanies,
  getSeedComments,
  type NewsFeedCategory,
  type NewsSentiment,
} from "@/lib/news/experience";
import { Character, type CharacterPose, type CharacterSize } from "./Character";
import type { NewsInteractions } from "./useNewsInteractions";

export type RelatedNewsIndicator = NewsRelatedIndicator;

type NewsLoadState = "loading" | "ready" | "empty" | "error";

const isHttpUrl = (value: string) => /^https?:\/\//.test(value);

function Donddok({ pose = "news", size = "sm" }: { pose?: CharacterPose; size?: CharacterSize }) {
  return <Character className="news-mascot" pose={pose} size={size} alt="경제 뉴스를 설명하는 돈똑" />;
}

function NewsThumbnail({ item, large = false }: { item: NewsItem; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const source = item.thumbnailUrl || item.imageUrl || item.thumbnail;
  if (!source || failed) return null;
  return (
    <span className={`news-feed-thumbnail${large ? " large" : ""}`}>
      {/* Third-party publisher images remain external and are never persisted by this component. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={source} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
    </span>
  );
}

function NewsPageHeader({
  title,
  onBack,
  bookmarked,
  onBookmark,
  onShare,
  onSearch,
  onNotify,
}: {
  title: string;
  onBack?: () => void;
  bookmarked?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  onSearch?: () => void;
  onNotify?: () => void;
}) {
  return (
    <header className="news-experience-header">
      <div className="news-experience-header-start">
        {onBack ? <button className="news-icon-button" onClick={onBack} aria-label="이전 화면"><ArrowLeft aria-hidden="true" /></button> : null}
        <strong>{title}</strong>
      </div>
      <div className="news-experience-header-actions">
        {onSearch ? <button className="news-icon-button" onClick={onSearch} aria-label="뉴스 검색"><Search aria-hidden="true" /></button> : null}
        {onNotify ? <button className="news-icon-button notification" onClick={onNotify} aria-label="뉴스 알림"><Bell aria-hidden="true" /><i /></button> : null}
        {onBookmark ? <button className={`news-icon-button${bookmarked ? " selected" : ""}`} onClick={onBookmark} aria-label={bookmarked ? "저장 해제" : "뉴스 저장"}><Bookmark aria-hidden="true" /></button> : null}
        {onShare ? <button className="news-icon-button" onClick={onShare} aria-label="뉴스 공유"><Share2 aria-hidden="true" /></button> : null}
      </div>
    </header>
  );
}

function NewsFeedCard({ item, onOpen, bookmarked, onBookmark }: { item: NewsItem; onOpen: () => void; bookmarked: boolean; onBookmark: () => void }) {
  const category = getNewsFeedCategory(item);
  const companies = getRelatedCompanies(item);
  const metrics = getNewsMetrics(item);
  return (
    <article className="news-feed-card">
      <button className="news-feed-card-main" onClick={onOpen}>
        <span className="news-feed-copy">
          <span className="news-feed-overline"><b data-kind={category}>{category}</b><time>{formatNewsTime(item.publishedAtRaw)}</time></span>
          <strong>{item.title}</strong>
          {companies.length ? <span className="news-company-tags">{companies.slice(0, 3).map((company) => <i key={company.symbol}>${company.symbol}</i>)}{companies.length > 3 ? <i>+{companies.length - 3}</i> : null}</span> : null}
          <span className="news-feed-stats"><span><Eye aria-hidden="true" />{formatCompactCount(metrics.viewCount)}</span><span><MessageCircle aria-hidden="true" />{metrics.commentCount}</span><span>{item.publisher}</span></span>
        </span>
        <NewsThumbnail item={item} />
      </button>
      <button className={`news-feed-save${bookmarked ? " selected" : ""}`} onClick={onBookmark} aria-label={bookmarked ? "저장 해제" : "뉴스 저장"}><Bookmark aria-hidden="true" /></button>
    </article>
  );
}

export function NewsMainView({
  items,
  loadState,
  category,
  query,
  bookmarkedIds,
  previewMode,
  notice,
  onCategory,
  onQuery,
  onOpen,
  onBookmark,
  onRetry,
  onNotify,
}: {
  items: NewsItem[];
  loadState: NewsLoadState;
  category: NewsFeedCategory;
  query: string;
  bookmarkedIds: Set<string>;
  previewMode: boolean;
  notice: string;
  onCategory: (category: NewsFeedCategory) => void;
  onQuery: (value: string) => void;
  onOpen: (id: string) => void;
  onBookmark: (id: string) => void;
  onRetry: () => void;
  onNotify: () => void;
}) {
  const groups = useMemo(() => {
    const grouped = new Map<string, NewsItem[]>();
    items.forEach((item) => {
      const date = formatNewsDate(item.publishedAtRaw);
      grouped.set(date, [...(grouped.get(date) ?? []), item]);
    });
    return [...grouped.entries()];
  }, [items]);

  return (
    <>
      <NewsPageHeader title="뉴스" onSearch={() => document.getElementById("news-hub-search")?.focus()} onNotify={onNotify} />
      <div className="screen-content news-hub-page">
        <section className="news-hub-intro">
          <div><h1>오늘 시장에 영향을 줄 수 있는<br />주요 소식을 모았어요.</h1><p>뉴스의 사실과 시장의 흐름을 쉽게 연결해보세요.</p></div>
          <Donddok size="md" />
        </section>
        {previewMode ? <div className="news-preview-banner" role="status"><Sparkles aria-hidden="true" /><div><strong>미리보기 데이터</strong><p>화면 확인을 위한 가상 뉴스예요. 실제 기사나 투자 정보가 아닙니다.</p></div></div> : null}
        {notice ? <div className="news-inline-notice" role="status"><Check aria-hidden="true" />{notice}</div> : null}
        <label className="news-hub-search" htmlFor="news-hub-search"><Search aria-hidden="true" /><input id="news-hub-search" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="뉴스·기업·경제 키워드 검색" /></label>
        <div className="news-category-scroll" aria-label="뉴스 카테고리">
          {NEWS_FEED_CATEGORIES.map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => onCategory(item)} aria-pressed={category === item}>{item}</button>)}
        </div>

        {loadState === "loading" ? <div className="news-feed-loading">{Array.from({ length: 5 }, (_, index) => <i key={index} />)}</div> : null}
        {loadState === "error" ? <div className="news-feed-state"><strong>뉴스를 불러오지 못했어요.</strong><p>잠시 후 다시 시도해 주세요.</p><button onClick={onRetry}>다시 시도</button></div> : null}
        {loadState === "empty" || (loadState === "ready" && !items.length) ? <div className="news-feed-state"><strong>조건에 맞는 뉴스가 없어요.</strong><p>다른 카테고리나 키워드를 확인해 보세요.</p></div> : null}
        {loadState === "ready" ? groups.map(([date, dateItems]) => (
          <section className="news-date-group" key={date}>
            <div className="news-date-heading"><div><span>오늘 주요뉴스</span><h2>{date}</h2></div><small>{dateItems.length}개 소식</small></div>
            <div className="news-feed-list">{dateItems.map((item) => <NewsFeedCard key={item.id} item={item} onOpen={() => onOpen(item.id)} bookmarked={bookmarkedIds.has(item.id)} onBookmark={() => onBookmark(item.id)} />)}</div>
          </section>
        )) : null}
      </div>
    </>
  );
}

function RelatedCompanies({ item }: { item: NewsItem }) {
  const companies = getRelatedCompanies(item);
  if (!companies.length) return null;
  return (
    <section className="news-detail-section">
      <div className="news-section-title"><div><span>기업 연결</span><h2>관련 기업</h2></div></div>
      <div className="news-related-companies">
        {companies.map((company) => <Link key={company.symbol} href={`/research?company=${encodeURIComponent(company.symbol)}`}><span><Building2 aria-hidden="true" /></span><strong>{company.name}</strong><small>{company.symbol}</small><ChevronRight aria-hidden="true" /></Link>)}
      </div>
    </section>
  );
}

function RelatedIndicators({ indicators, preview = false }: { indicators: RelatedNewsIndicator[]; preview?: boolean }) {
  if (!indicators.length) return null;
  return (
    <section className="news-detail-section">
      <div className="news-section-title"><div><span>{preview ? "미리보기 지표" : "실제 데이터"}</span><h2>관련 지표</h2></div><button>더보기 <ChevronRight aria-hidden="true" /></button></div>
      <div className="news-related-indicators">{indicators.map((indicator) => <article key={indicator.id}><span>{indicator.name}</span><strong>{indicator.value}</strong><em data-direction={indicator.direction}>{indicator.direction === "down" ? <TrendingDown aria-hidden="true" /> : indicator.direction === "steady" ? <Minus aria-hidden="true" /> : <TrendingUp aria-hidden="true" />}{indicator.change}</em></article>)}</div>
    </section>
  );
}

function CommentSection({ item, interactions, onNotice }: { item: NewsItem; interactions: NewsInteractions; onNotice: (message: string) => void }) {
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [content, setContent] = useState("");
  const metrics = getNewsMetrics(item);
  const comments = [...getSeedComments(item), ...interactions.commentsFor(item.id)];
  const visibleComments = [...comments].sort((a, b) => sort === "popular" ? b.likeCount - a.likeCount : Date.parse(b.createdAt) - Date.parse(a.createdAt));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    const result = interactions.addComment(item.id, content);
    if (result === "auth") return onNotice("댓글을 남기려면 로그인이 필요해요.");
    setContent("");
    onNotice("의견을 남겼어요.");
  };

  return (
    <section className="news-comments-section">
      <div className="news-comments-heading"><h2>댓글 {metrics.commentCount + interactions.commentsFor(item.id).length}</h2><button onClick={() => setSort((current) => current === "latest" ? "popular" : "latest")}>{sort === "latest" ? "최신순" : "인기순"}<ChevronDown aria-hidden="true" /></button></div>
      <div className="news-comment-list">
        {visibleComments.map((comment) => {
          const liked = interactions.isCommentLiked(item.id, comment.id);
          const reported = interactions.isCommentReported(item.id, comment.id);
          const mine = interactions.user?.id === comment.userId;
          return (
            <article className="news-comment" key={comment.id}>
              <span className="comment-avatar" aria-hidden="true">{comment.userName.slice(0, 1)}</span>
              <div><div className="comment-meta"><strong>{comment.userName}</strong><time>{comment.id.startsWith("preview-comment-") ? "미리보기" : comment.id.startsWith("seed-") ? "2시간 전" : "방금 전"}</time></div><p>{comment.content}</p><div className="comment-actions"><button className={liked ? "selected" : ""} onClick={() => interactions.toggleCommentLike(item.id, comment)}><Heart aria-hidden="true" />{comment.likeCount + (liked ? 1 : 0)}</button><button onClick={() => onNotice("대댓글은 Phase 2에서 연결할 예정이에요.")}>답글</button>{mine ? <button onClick={() => interactions.deleteComment(item.id, comment.id)}><Trash2 aria-hidden="true" />삭제</button> : <button disabled={reported} onClick={() => { interactions.reportComment(item.id, comment); onNotice("댓글을 신고했어요."); }}><Flag aria-hidden="true" />{reported ? "신고됨" : "신고"}</button>}</div></div>
            </article>
          );
        })}
      </div>
      <form className="news-comment-composer" onSubmit={submit}>
        <span className="comment-avatar" aria-hidden="true">{interactions.user?.name.slice(0, 1) ?? "?"}</span>
        <input value={content} onChange={(event) => setContent(event.target.value)} maxLength={500} placeholder="의견을 남겨주세요." aria-label="댓글 입력" />
        <button type="submit" disabled={!content.trim()} aria-label="댓글 전송"><Send aria-hidden="true" /></button>
      </form>
    </section>
  );
}

export function NewsDetailView({
  item,
  indicators = [],
  bookmarked,
  notice,
  interactions,
  onBack,
  onBookmark,
  onOpenExplain,
  onNotice,
}: {
  item: NewsItem;
  indicators?: RelatedNewsIndicator[];
  bookmarked: boolean;
  notice: string;
  interactions: NewsInteractions;
  onBack: () => void;
  onBookmark: () => void;
  onOpenExplain: () => void;
  onNotice: (message: string) => void;
}) {
  const ai = buildNewsAiContent(item);
  const companies = getRelatedCompanies(item);
  const metrics = getNewsMetrics(item);
  const sentiment = interactions.sentimentFor(item.id);
  const feedback = interactions.feedbackFor(item.id);
  const previewFeedback = item.previewContent?.feedback;
  const participation = metrics.participation + (sentiment ? 1 : 0);
  const positive = metrics.positive + (sentiment === "positive" ? 1 : 0);
  const positivePercent = Math.round(positive / participation * 100);
  const negativePercent = 100 - positivePercent;
  const sourceUrl = [item.originalLink, item.originalUrl, item.link, item.sourceUrl].find(isHttpUrl);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: item.title, text: item.summary, url });
      else { await navigator.clipboard.writeText(url); onNotice("뉴스 링크를 복사했어요."); }
    } catch {
      // The user may dismiss the native share sheet.
    }
  };

  const vote = (value: NewsSentiment) => {
    const result = interactions.vote(item.id, value);
    if (result === "auth") onNotice("투표하려면 로그인이 필요해요.");
    else if (result === "duplicate") onNotice("이미 이 뉴스에 참여했어요.");
    else onNotice("의견을 반영했어요.");
  };

  return (
    <>
      <NewsPageHeader title="뉴스 상세" onBack={onBack} bookmarked={bookmarked} onBookmark={onBookmark} onShare={() => void share()} />
      <article className="screen-content news-detail-page">
        {item.previewContent ? <div className="news-preview-banner compact" role="status"><Sparkles aria-hidden="true" /><div><strong>미리보기 데이터</strong><p>UI 확인을 위한 가상 기사와 예시 반응입니다.</p></div></div> : null}
        {notice ? <div className="news-inline-notice" role="status"><Check aria-hidden="true" />{notice}</div> : null}
        <header className="news-detail-hero-v2">
          <div className="news-detail-meta"><b data-kind={getNewsFeedCategory(item)}>{getNewsFeedCategory(item)}</b><span>{formatNewsDateTime(item.publishedAtRaw)} · 출처: {item.publisher}</span></div>
          <h1>{item.title}</h1>
          {companies.length ? <div className="news-company-tags detail">{companies.map((company) => <i key={company.symbol}>${company.symbol} {company.name}</i>)}</div> : null}
          <NewsThumbnail item={item} large />
        </header>

        <section className="news-ai-summary">
          <div className="news-section-title"><div><span>돈똑이가 정리했어요</span><h2>AI 핵심 요약</h2></div><Donddok pose="analyze" /></div>
          <ul>{ai.shortSummary.map((summary) => <li key={summary}>{summary}</li>)}</ul>
          <p className="ai-source-note">{item.previewContent ? "이 요약은 뉴스 UI 확인을 위한 가상 예시이며, 실제 기사나 투자 권유가 아니에요." : "AI 요약은 제목·요약·출처 메타데이터를 기반으로 하며, 투자 권유가 아니에요."}</p>
        </section>

        <button className="news-explain-cta" onClick={onOpenExplain}><Donddok pose="aha" /><span><b>3분 만에 이해하기</b><small>이 뉴스가 왜 중요한지 쉽게 설명해드릴게요.</small></span><ChevronRight aria-hidden="true" /></button>

        <RelatedIndicators indicators={indicators.length ? indicators : item.relatedIndicators ?? []} preview={Boolean(item.previewContent)} />
        <RelatedCompanies item={item} />

        {sourceUrl ? <a className="news-original-link" href={sourceUrl} target="_blank" rel="noreferrer noopener">원문 기사 보기 <ExternalLink aria-hidden="true" /></a> : null}

        <section className="news-reaction-section">
          <div className="news-section-title"><div><span>참여 {participation}명</span><h2>이 뉴스, 어떻게 보시나요?</h2><p>다른 사람들은 이렇게 보고 있어요.</p></div></div>
          <div className="news-sentiment-grid">
            <button className={sentiment === "positive" ? "selected" : ""} onClick={() => vote("positive")} disabled={Boolean(sentiment)}><TrendingUp aria-hidden="true" /><span>긍정적<strong>{positivePercent}%</strong></span></button>
            <button className={sentiment === "negative" ? "selected" : ""} onClick={() => vote("negative")} disabled={Boolean(sentiment)}><TrendingDown aria-hidden="true" /><span>부정적<strong>{negativePercent}%</strong></span></button>
          </div>
          <div className="news-explanation-feedback"><strong>돈똑의 설명은 어땠나요?</strong><div><button className={feedback === "helpful" ? "selected" : ""} onClick={() => { interactions.rateExplanation(item.id, "helpful"); onNotice("피드백을 반영했어요."); }}><ThumbsUp aria-hidden="true" />도움됐어요{previewFeedback ? <small>{previewFeedback.helpful + (feedback === "helpful" ? 1 : 0)}</small> : null}</button><button className={feedback === "difficult" ? "selected" : ""} onClick={() => { interactions.rateExplanation(item.id, "difficult"); onNotice("더 쉽게 설명할 수 있도록 반영할게요."); }}><Brain aria-hidden="true" />어려워요{previewFeedback ? <small>{previewFeedback.difficult + (feedback === "difficult" ? 1 : 0)}</small> : null}</button></div></div>
        </section>

        <CommentSection item={item} interactions={interactions} onNotice={onNotice} />
      </article>
    </>
  );
}

export function NewsExplainView({ item, onBack }: { item: NewsItem; onBack: () => void }) {
  const ai = buildNewsAiContent(item);
  const steps = [
    { number: "01", title: "무슨 일이 있었나요?", body: ai.whatHappened },
    { number: "02", title: "왜 중요한가요?", body: ai.whyImportant },
    { number: "03", title: "그래서 어떤 영향이 있나요?", body: ai.impact },
    { number: "04", title: "나에게는 어떤 의미가 있나요?", body: ai.personalMeaning },
    { number: "05", title: "이것만 기억하세요", body: ai.keyTakeaway },
  ];
  return (
    <>
      <NewsPageHeader title="3분 만에 이해하기" onBack={onBack} />
      <article className="screen-content news-explain-page">
        {item.previewContent ? <div className="news-preview-banner compact" role="status"><Sparkles aria-hidden="true" /><div><strong>미리보기 데이터</strong><p>아래 해설은 UI 확인을 위한 가상 예시입니다.</p></div></div> : null}
        <section className="news-explain-intro"><Donddok pose="aha" size="md" /><div><span>EconFlow AI 해설</span><h1>어려운 경제 뉴스,<br />쉽게 설명해드릴게요.</h1><p>{item.title}</p></div></section>
        <div className="news-explain-steps">{steps.map((step) => <section className="news-explain-step" key={step.number}><span>{step.number}</span><div><h2>{step.title}</h2><p>{step.body}</p></div>{step.number === "05" ? <Donddok pose="joy" /> : null}</section>)}</div>
        <aside className="news-explain-disclaimer">이 해설은 뉴스 이해를 돕기 위한 정보이며, 특정 종목의 매수·매도를 권유하지 않아요.
        </aside>
      </article>
    </>
  );
}
