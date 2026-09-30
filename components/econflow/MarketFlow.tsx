"use client";

import Link from "next/link";
import {
  ArrowDown,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Landmark,
  ReceiptText,
  ShoppingBasket,
  Sparkles,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { FlowStep, MarketFlow, MarketFlowDirection, MarketFlowIcon } from "@/data/market-flow";
import { Character } from "./Character";

const FLOW_ICONS: Record<MarketFlowIcon, LucideIcon> = {
  basket: ShoppingBasket,
  bank: Landmark,
  bond: ReceiptText,
  dollar: CircleDollarSign,
  chart: ChartNoAxesCombined,
};

function FlowIcon({ icon, direction }: { icon: MarketFlowIcon; direction: MarketFlowDirection }) {
  const Icon = FLOW_ICONS[icon];
  return <span className="market-flow-icon" data-direction={direction}><Icon aria-hidden="true" /></span>;
}

function FlowDirection({ direction }: { direction: MarketFlowDirection }) {
  if (direction === "up") return <TrendingUp aria-label="상승 압력" />;
  if (direction === "down") return <TrendingDown aria-label="하락 압력" />;
  return <Sparkles aria-label="영향 가능" />;
}

export function HomeMarketFlowCard({ flow }: { flow: MarketFlow }) {
  return (
    <Link
      href="/market-flow"
      className="home-market-flow-card"
      aria-label={`${flow.title} 흐름 자세히 보기`}
    >
      <div className="home-market-flow-head">
        <span>오늘의 ECON FLOW</span>
        <strong>{flow.title}</strong>
      </div>

      <div className="home-market-flow-track" aria-label="오늘의 시장 흐름 요약">
        {flow.steps.map((step, index) => (
          <div className="home-market-flow-node-wrap" key={step.id}>
            <div className="home-market-flow-node">
              <FlowIcon icon={step.icon} direction={step.direction} />
              <span><small>{step.label}</small><strong>{step.shortTitle ?? step.title}</strong></span>
            </div>
            {index < flow.steps.length - 1 ? <ArrowDown className="home-market-flow-arrow" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>

      <div className="home-market-flow-prompt">
        <Character pose="aha" size="sm" alt="시장 흐름을 설명하는 돈똑" />
        <span>오늘 시장이 왜 이렇게 움직였는지<br />연결해서 볼까요?</span>
        <ChevronRight aria-hidden="true" />
      </div>
    </Link>
  );
}

function MarketFlowStep({ step, index }: { step: FlowStep; index: number }) {
  const panelId = `market-flow-step-${step.id}`;
  return (
    <details className="market-flow-step-card" name="market-flow-steps" open={index === 0}>
      <summary className="market-flow-step-toggle" aria-controls={panelId}>
        <span className="market-flow-step-number">{index + 1}</span>
        <FlowIcon icon={step.icon} direction={step.direction} />
        <span className="market-flow-step-copy">
          <small>{step.label}</small>
          <strong>{step.title}</strong>
        </span>
        <ChevronDown className="market-flow-step-chevron" aria-hidden="true" />
      </summary>
      <div className="market-flow-step-answer" id={panelId}><strong>{step.question}</strong><p>{step.description}</p></div>
    </details>
  );
}

export function MarketFlowDetail({ flow }: { flow: MarketFlow }) {
  return (
    <article className="screen-content market-flow-detail-page">
      <header className="market-flow-detail-hero">
        <div>
          <span>오늘의 ECON FLOW</span>
          <h1>{flow.title}</h1>
          <p>{flow.summary}</p>
        </div>
        <Character pose="market" size="md" alt="오늘의 시장 흐름을 살펴보는 돈똑" />
      </header>

      <section className="market-flow-detail-section" aria-labelledby="market-flow-steps-title">
        <div className="market-flow-detail-heading"><div><span>{flow.category}</span><h2 id="market-flow-steps-title">무슨 일이 어떻게 이어졌나요?</h2></div><small>{flow.date}</small></div>
        <div className="market-flow-step-list">
          {flow.steps.map((step, index) => (
            <div className="market-flow-step-wrap" key={step.id}>
              <MarketFlowStep step={step} index={index} />
              {step.connection ? <div className="market-flow-connection"><ArrowDown aria-hidden="true" /><span>{step.connection}</span></div> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="market-flow-impact-section" aria-labelledby="market-flow-impact-title">
        <div className="market-flow-detail-heading"><div><span>생활과 투자 연결</span><h2 id="market-flow-impact-title">그래서 내 돈에는?</h2></div><small>영향 가능성</small></div>
        <div className="market-flow-impact-grid">
          {flow.impacts.map((impact) => (
            <article className="market-flow-impact-card" data-direction={impact.direction} key={impact.asset}>
              <FlowDirection direction={impact.direction} />
              <strong>{impact.asset}</strong>
              <span>{impact.label}</span>
              <p>{impact.description}</p>
            </article>
          ))}
        </div>
        <p className="market-flow-disclaimer">시장 사이의 일반적인 영향 관계를 설명한 정보예요. 가격 방향을 단정하거나 특정 자산의 매수·매도를 권유하지 않아요.</p>
      </section>
    </article>
  );
}
