"use client";

import {
  BadgeDollarSign,
  BookOpen,
  Building2,
  ChartNoAxesCombined,
  ChevronRight,
  Clock3,
  Cpu,
  Factory,
  FileText,
  Globe2,
  Landmark,
  PencilLine,
  Search,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Issue } from "@/data/issues";
import type { Lesson } from "@/data/lessons";
import type { MarketIndicator } from "@/data/market";
import type { NewsItem } from "@/data/news";
import { Character } from "./Character";
import { MiniSparkline, formatMarketValue } from "./market";
import { Badge, PrimaryButton } from "./primitives";

const issueThumbnail = (issue: Issue) => {
  if (issue.category === "산업") return "/news/technology.webp";
  if (issue.category === "환율" || issue.category === "글로벌") return "/news/currency.webp";
  return "/news/rates.webp";
};

export function MarketStrip({ indicators, onSelect }: { indicators: MarketIndicator[]; onSelect: (id: string) => void }) {
  return (
    <div className="market-strip" aria-label="주요 경제 지표">
      {indicators.map((indicator) => (
        <button key={indicator.id} className="market-ticker" data-direction={indicator.direction} onClick={() => onSelect(indicator.id)}>
          <span className="market-ticker-top"><strong>{indicator.shortName}</strong><small>{indicator.country}</small></span>
          <b>{formatMarketValue(indicator)}</b>
          <span className="market-ticker-bottom">
            <em>{indicator.direction === "steady" ? "0.00%" : `${indicator.changePercent > 0 ? "+" : ""}${indicator.changePercent.toFixed(2)}%`}</em>
            <MiniSparkline values={indicator.sparkline} direction={indicator.direction} />
          </span>
        </button>
      ))}
    </div>
  );
}

export function IssueHierarchy({ items, onSelect }: { items: Issue[]; onSelect: (id: string) => void }) {
  const [lead, ...secondary] = items;
  if (!lead) return null;
  return (
    <div className="issue-hierarchy">
      <button className="lead-issue" onClick={() => onSelect(lead.id)}>
        <img src={issueThumbnail(lead)} alt="" />
        <span className="lead-issue-overlay" />
        <span className="lead-issue-copy">
          <Badge>{lead.category}</Badge>
          <strong>{lead.title}</strong>
          <small>{lead.summary}</small>
        </span>
      </button>
      <div className="secondary-issues">
        {secondary.slice(0, 2).map((issue, index) => (
          <button key={issue.id} onClick={() => onSelect(issue.id)}>
            <span className="issue-rank">{index + 2}</span>
            <span><strong>{issue.title}</strong><small>{issue.summary}</small></span>
            <img src={issueThumbnail(issue)} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function DailyStory({ issue, onSelect }: { issue: Issue; onSelect: () => void }) {
  return (
    <section className="daily-story" aria-labelledby="daily-story-title">
      <div className="daily-story-copy">
        <span className="story-label">{issue.keywords.slice(0, 2).join(" · ")}</span>
        <span className="story-time"><Clock3 aria-hidden="true" /> 3분 만에 이해하기</span>
        <h2 id="daily-story-title">{issue.title}</h2>
        <p>{issue.summary}</p>
        <PrimaryButton onClick={onSelect}>지금 이해하기 <ChevronRight aria-hidden="true" /></PrimaryButton>
      </div>
      <Character pose="discover" size="lg" />
    </section>
  );
}

export function HomeLearningCard({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  return (
    <section className="home-learning-card" aria-labelledby="home-learning-title">
      <div>
        <span>오늘 5분 경제 공부</span>
        <h2 id="home-learning-title">{lesson.title}</h2>
        <p><Clock3 aria-hidden="true" /> {lesson.duration} · {lesson.difficulty}</p>
        <PrimaryButton onClick={onStart}>지금 시작하기 <ChevronRight aria-hidden="true" /></PrimaryButton>
      </div>
      <Character pose="study" size="lg" />
    </section>
  );
}

export function StudyMission({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  return (
    <section className="study-mission" aria-labelledby="mission-title">
      <div className="mission-copy">
        <div className="mission-label-row"><Badge>오늘의 학습 미션</Badge><span>1/3 완료</span></div>
        <h2 id="mission-title">{lesson.title}</h2>
        <p>{lesson.description}</p>
        <Progress className="mission-progress" value={34} aria-label="오늘의 학습 진행률 34퍼센트" />
        <div className="mission-meta"><span><Clock3 aria-hidden="true" /> {lesson.duration}</span><span>초급</span></div>
        <PrimaryButton onClick={onStart}>학습 시작하기 <ChevronRight aria-hidden="true" /></PrimaryButton>
      </div>
      <Character pose="study" size="lg" />
    </section>
  );
}

const learningCategories = [
  { label: "경제 기초", icon: BookOpen, tone: "blue" },
  { label: "금리·채권", icon: Landmark, tone: "navy" },
  { label: "주식 시장", icon: ChartNoAxesCombined, tone: "mint" },
  { label: "환율·글로벌", icon: Globe2, tone: "sky" },
];

export function StudyCategoryGrid({ onSelect }: { onSelect: (category: string) => void }) {
  return (
    <div className="learning-category-grid">
      {learningCategories.map(({ label, icon: Icon, tone }) => (
        <button key={label} data-tone={tone} onClick={() => onSelect(label)}><span><Icon aria-hidden="true" /></span><strong>{label}</strong><ChevronRight aria-hidden="true" /></button>
      ))}
    </div>
  );
}

const companies = [
  { name: "삼성전자", ticker: "005930", mark: "S", tone: "blue", change: "+2.3%" },
  { name: "SK하이닉스", ticker: "000660", mark: "SK", tone: "red", change: "+1.8%" },
  { name: "NAVER", ticker: "035420", mark: "N", tone: "green", change: "-0.4%" },
  { name: "현대차", ticker: "005380", mark: "H", tone: "navy", change: "+1.2%" },
];

const industries = [
  { label: "AI/반도체", icon: Cpu },
  { label: "2차전지", icon: BadgeDollarSign },
  { label: "바이오", icon: Building2 },
  { label: "자동차", icon: ChartNoAxesCombined },
  { label: "조선/방산", icon: Factory },
];

export function ResearchHub({ query, onQuery, issues, news, onOpenIssue, onOpenNews }: { query: string; onQuery: (value: string) => void; issues: Issue[]; news: NewsItem[]; onOpenIssue: (id: string) => void; onOpenNews: (id: string) => void }) {
  const visibleCompanies = companies.filter((company) => `${company.name} ${company.ticker}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="research-hub">
      <label className="search-field research-search" htmlFor="company-search"><Search aria-hidden="true" /><input id="company-search" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="기업명, 산업명, 키워드로 검색해보세요" /></label>

      <section className="research-section">
        <div className="research-heading"><h2>요즘 많이 보는 기업</h2><button>전체보기 <ChevronRight aria-hidden="true" /></button></div>
        <div className="company-grid">
          {visibleCompanies.map((company) => <button key={company.ticker}><span data-tone={company.tone}>{company.mark}</span><strong>{company.name}</strong><small className={company.change.startsWith("-") ? "negative" : "positive"}>{company.change}</small></button>)}
          {!visibleCompanies.length ? <div className="research-empty">검색된 기업이 없어요.</div> : null}
        </div>
      </section>

      <section className="research-section">
        <div className="research-heading"><h2>산업으로 찾기</h2></div>
        <div className="industry-grid">{industries.map(({ label, icon: Icon }) => <button key={label}><Icon aria-hidden="true" /><span>{label}</span></button>)}</div>
      </section>

      <section className="research-section">
        <div className="research-heading"><h2>최근 리서치 리포트</h2><button>전체보기 <ChevronRight aria-hidden="true" /></button></div>
        <div className="report-list">{issues.slice(0, 3).map((issue) => <button key={issue.id} onClick={() => onOpenIssue(issue.id)}><span className="report-icon"><FileText aria-hidden="true" /></span><span><em>{issue.category} 리서치</em><strong>{issue.title}</strong><small>{issue.publishedAt} · 3분 리포트</small></span><ChevronRight aria-hidden="true" /></button>)}</div>
      </section>

      <section className="research-section research-notes">
        <div className="research-heading"><h2>내 리서치 노트</h2><button>전체보기 <ChevronRight aria-hidden="true" /></button></div>
        <div className="note-list">{news.slice(0, 3).map((item, index) => <button key={item.id} onClick={() => onOpenNews(item.id)}><span className="note-mark"><PencilLine aria-hidden="true" /></span><span><strong>{item.keywords[0] ?? item.category}</strong><small>노트 {3 - index}개 · {item.publishedAt}</small></span><ChevronRight aria-hidden="true" /></button>)}</div>
      </section>
    </div>
  );
}
