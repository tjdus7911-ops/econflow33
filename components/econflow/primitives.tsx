"use client";

import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  BookOpen,
  Building2,
  ChartNoAxesCombined,
  Clock3,
  Home,
  Info,
  Newspaper,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Issue } from "@/data/issues";
import type { Lesson } from "@/data/lessons";
import type { NewsItem } from "@/data/news";
import { Character, EconFlowCharacter } from "./Character";
export { Character, EconFlowCharacter };
export type { CharacterPose, CharacterSize } from "./Character";

export type MainTab = "home" | "news" | "research" | "market" | "profile";

export function AppHeader({
  title,
  onBack,
  action = "none",
  onAction,
  onSearch,
}: {
  title: string;
  onBack?: () => void;
  action?: "none" | "bell" | "search" | "settings" | "info" | "home";
  onAction?: () => void;
  onSearch?: () => void;
}) {
  const ActionIcon = action === "bell" ? Bell : action === "settings" ? Settings : action === "info" ? Info : Search;
  return (
    <header className="app-header">
      <div className="header-side">
        {onBack ? (
          <button className="icon-button subtle" onClick={onBack} aria-label="이전 화면">
            <ArrowLeft aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <strong className={onBack ? "header-title centered" : "brand"}>{title === "EconFlow" ? <>Econ<span>Flow</span></> : title}</strong>
      <div className="header-side end">
        {action === "home" ? <>
          <button className="icon-button" onClick={onSearch} aria-label="검색"><Search aria-hidden="true" /></button>
          <button className="icon-button" onClick={onAction} aria-label="알림"><Bell aria-hidden="true" /><span className="notification-dot" /></button>
        </> : action !== "none" ? (
          <button className="icon-button" onClick={onAction} aria-label={action === "bell" ? "알림" : action === "settings" ? "설정" : action === "info" ? "데이터 안내" : "검색"}>
            <ActionIcon aria-hidden="true" />
            {action === "bell" ? <span className="notification-dot" /> : null}
          </button>
        ) : null}
      </div>
    </header>
  );
}

export function BottomNavigation({ active, onNavigate }: { active: MainTab | null; onNavigate: (tab: MainTab) => void }) {
  const items = [
    { id: "home" as const, label: "홈", icon: Home },
    { id: "news" as const, label: "뉴스", icon: Newspaper },
    { id: "research" as const, label: "리서치", icon: Building2 },
    { id: "market" as const, label: "시장", icon: ChartNoAxesCombined },
    { id: "profile" as const, label: "내 정보", icon: User },
  ];
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => onNavigate(item.id)} aria-current={active === item.id ? "page" : undefined}>
            <Icon aria-hidden="true" /><span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function SectionHeader({ kicker, title, count, actionLabel = "전체보기", onAction }: { kicker?: string; title: string; count?: number; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="section-heading">
      <div>
        {kicker ? <span className="section-kicker">{kicker}</span> : null}
        <h2>{title}{typeof count === "number" ? <em>{count}</em> : null}</h2>
      </div>
      {onAction ? <button className="text-button" onClick={onAction}>{actionLabel} <ArrowRight aria-hidden="true" /></button> : null}
    </div>
  );
}

export function CategoryChip({ label, selected, onClick }: { label: string; selected?: boolean; onClick: () => void }) {
  return <button className={`category-chip${selected ? " selected" : ""}`} onClick={onClick} aria-pressed={selected}>{label}</button>;
}

export function Badge({ children, tone = "navy" }: { children: ReactNode; tone?: "navy" | "blue" | "soft" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function PrimaryButton({ children, onClick, secondary = false, className = "" }: { children: ReactNode; onClick?: () => void; secondary?: boolean; className?: string }) {
  return <Button className={`primary-button ${secondary ? "secondary" : ""} ${className}`} size="lg" onClick={onClick}>{children}</Button>;
}

export function IssueCard({ issue, compact = false, onClick }: { issue: Issue; compact?: boolean; onClick: () => void }) {
  const TrendIcon = issue.direction === "down" ? TrendingDown : TrendingUp;
  if (compact) {
    return (
      <button className="issue-card" data-category={issue.category} onClick={onClick}>
        <span>{issue.category === "금리" ? "미국 금리" : issue.category === "환율" ? "원/달러 환율" : issue.category}</span>
        <strong>{issue.shortTitle}</strong>
        <div className={`metric ${issue.direction === "down" ? "fall" : issue.direction === "steady" ? "steady" : "rise"}`}>
          <TrendIcon aria-hidden="true" /> {issue.status}
        </div>
      </button>
    );
  }
  return (
    <article className="issue-list-card">
      <div className="issue-card-top"><Badge tone="blue">{issue.category}</Badge><span>{issue.publishedAt}</span></div>
      <h3>{issue.title}</h3>
      <p>{issue.summary}</p>
      <div className="why-box"><strong>왜 중요한가요?</strong><span>{issue.impact}</span></div>
      <button className="card-link" onClick={onClick}>쉽게 이해하기 <ArrowRight aria-hidden="true" /></button>
    </article>
  );
}

const fallbackNewsThumbnail = (item: NewsItem) => {
  const text = `${item.title} ${item.category} ${item.keywords.join(" ")}`;
  if (/AI|반도체|데이터센터|산업|테크/.test(text)) return "/news/technology.webp";
  if (/환율|달러|원화|글로벌|운임/.test(text)) return "/news/currency.webp";
  return "/news/rates.webp";
};

export function FeaturedNewsCard({ item, onClick, bookmarked = false, onBookmark }: { item: NewsItem; onClick: () => void; bookmarked?: boolean; onBookmark?: () => void }) {
  const thumbnail = item.imageUrl || item.thumbnail || fallbackNewsThumbnail(item);
  return (
    <article className="featured-news" data-category={item.category}>
      <button className="featured-news-main" onClick={onClick}>
      <span className={`featured-news-visual tone-${item.category}`}>
        <img src={thumbnail} alt="" />
      </span>
      <span className="featured-news-copy">
        <span className="news-label-row"><Badge tone="blue">{item.category}</Badge><span className={`content-type-label ${item.contentType}`}>{item.contentType === "briefing" ? "BRIEFING" : "NEWS"}</span></span>
        <strong>{item.title}</strong>
        <span>{item.summary}</span>
        <small>{item.publishedAt}</small>
      </span>
      </button>
      <button className={`news-bookmark${bookmarked ? " saved" : ""}`} onClick={onBookmark} aria-label={bookmarked ? "북마크 해제" : "북마크 저장"}><Bookmark aria-hidden="true" /></button>
    </article>
  );
}

export function NewsCard({ item, compact = false, onClick, bookmarked = false, onBookmark }: { item: NewsItem; compact?: boolean; onClick: () => void; bookmarked?: boolean; onBookmark?: () => void }) {
  const thumbnail = item.imageUrl || item.thumbnail || fallbackNewsThumbnail(item);
  return (
    <article className={`news-card${compact ? " compact" : ""}`} data-category={item.category}>
      <button className="news-card-main" onClick={onClick}>
        <span className={`news-thumb tone-${item.category}`}><img src={thumbnail} alt="" /></span>
        <span className="news-copy">
          <strong>{item.title}</strong>
          {!compact ? <span className="news-summary">{item.summary}</span> : null}
          <span className="news-meta"><b>{item.category}</b><span>{item.publishedAt}</span></span>
        </span>
      </button>
      <button className={`news-bookmark${bookmarked ? " saved" : ""}`} onClick={onBookmark} aria-label={bookmarked ? "북마크 해제" : "북마크 저장"}><Bookmark aria-hidden="true" /></button>
    </article>
  );
}

export function LearningCard({ lesson, onClick, featured = false }: { lesson: Lesson; onClick: () => void; featured?: boolean }) {
  return (
    <button className={`learning-card${featured ? " featured" : ""}`} onClick={onClick}>
      <span className="lesson-icon"><BookOpen aria-hidden="true" /></span>
      <span className="lesson-copy">
        <span className="lesson-meta">{lesson.category} · {lesson.difficulty}</span>
        <strong>{lesson.title}</strong>
        <span>{lesson.description}</span>
        <span className="duration"><Clock3 aria-hidden="true" /> {lesson.duration}</span>
      </span>
      <ArrowRight className="lesson-arrow" aria-hidden="true" />
    </button>
  );
}

export function EconomicTermTooltip({ term, definition }: { term: string; definition: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="term-button">{term} <span aria-hidden="true">?</span></button>
        </TooltipTrigger>
        <TooltipContent className="term-tooltip" sideOffset={8}>{definition}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><Character size="sm" pose="empty" /><strong>{title}</strong><p>{description}</p></div>;
}
