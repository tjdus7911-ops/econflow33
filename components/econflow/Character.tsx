"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Canonical EconFlow character vocabulary. The legacy names at the bottom
 * remain available so existing screens keep working while new UI uses the
 * shared character language from the official mascot guide.
 */
export type CharacterPose =
  | "observer"
  | "curious"
  | "discover"
  | "check"
  | "happy"
  | "study"
  | "analyze"
  | "start"
  | "news"
  | "market"
  | "research"
  | "money"
  | "surprised"
  | "thinking"
  | "confused"
  | "success"
  | "sad"
  | "waiting"
  | "empty"
  | "default"
  | "notification"
  | "welcome"
  | "up"
  | "down"
  | "correct"
  | "cheer";

export type CharacterSize = "xs" | "sm" | "md" | "lg" | "xl";

export const CHARACTER_FALLBACK_ASSET = "/characters/econflow-default.png";

/**
 * Only assets that already exist in /public/characters are referenced here.
 * null means the final guide-specific asset has not been supplied yet; the
 * component then uses the neutral EconFlow fallback instead of inventing one.
 */
export const CHARACTER_ASSETS: Record<CharacterPose, string | null> = {
  observer: "/characters/econflow-research.png",
  curious: "/characters/econflow-thinking.png",
  discover: "/characters/econflow-success.png",
  check: "/characters/econflow-notification.png",
  happy: "/characters/econflow-welcome.png",
  study: "/characters/econflow-study.png",
  analyze: "/characters/econflow-research.png",
  start: null,
  news: "/characters/econflow-news.png",
  market: "/characters/econflow-market.png",
  research: "/characters/econflow-research.png",
  money: null,
  surprised: null,
  thinking: "/characters/econflow-thinking.png",
  confused: "/characters/econflow-thinking.png",
  success: "/characters/econflow-success.png",
  sad: "/characters/econflow-empty.png",
  waiting: "/characters/econflow-waiting.png",
  empty: "/characters/econflow-empty.png",

  // Backward-compatible names used by existing screens.
  default: CHARACTER_FALLBACK_ASSET,
  notification: "/characters/econflow-notification.png",
  welcome: "/characters/econflow-welcome.png",
  up: "/characters/econflow-market.png",
  down: "/characters/econflow-market.png",
  correct: "/characters/econflow-success.png",
  cheer: "/characters/econflow-welcome.png",
};

const CHARACTER_LABELS: Record<CharacterPose, string> = {
  observer: "경제를 관찰하는 EconFlow 캐릭터",
  curious: "궁금한 점을 살펴보는 EconFlow 캐릭터",
  discover: "경제 흐름을 발견한 EconFlow 캐릭터",
  check: "데이터를 확인하는 EconFlow 캐릭터",
  happy: "기뻐하는 EconFlow 캐릭터",
  study: "책을 읽으며 공부하는 EconFlow 캐릭터",
  analyze: "데이터를 분석하는 EconFlow 캐릭터",
  start: "EconFlow를 시작하는 캐릭터",
  news: "뉴스를 살펴보는 EconFlow 캐릭터",
  market: "시장 흐름을 관찰하는 EconFlow 캐릭터",
  research: "기업과 산업을 탐색하는 EconFlow 캐릭터",
  money: "돈의 흐름을 발견하는 EconFlow 캐릭터",
  surprised: "새로운 경제 현상에 놀란 EconFlow 캐릭터",
  thinking: "경제 개념을 고민하는 EconFlow 캐릭터",
  confused: "어려운 경제 개념을 살펴보는 EconFlow 캐릭터",
  success: "학습 완료를 축하하는 EconFlow 캐릭터",
  sad: "조금 아쉬워하는 EconFlow 캐릭터",
  waiting: "데이터를 기다리는 EconFlow 캐릭터",
  empty: "아쉬운 표정의 EconFlow 캐릭터",
  default: "EconFlow 캐릭터",
  notification: "알림을 확인하는 EconFlow 캐릭터",
  welcome: "반짝이며 환영하는 EconFlow 캐릭터",
  up: "시장 흐름을 관찰하는 EconFlow 캐릭터",
  down: "시장 흐름을 관찰하는 EconFlow 캐릭터",
  correct: "학습 완료를 축하하는 EconFlow 캐릭터",
  cheer: "반짝이며 환영하는 EconFlow 캐릭터",
};

export function EconFlowCharacter({
  pose = "observer",
  size = "md",
  className = "",
}: {
  pose?: CharacterPose;
  size?: CharacterSize;
  className?: string;
}) {
  const [failedPose, setFailedPose] = useState<CharacterPose | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const configuredAsset = CHARACTER_ASSETS[pose];
  const usesFallback = !configuredAsset || failedPose === pose;
  const src = usesFallback ? CHARACTER_FALLBACK_ASSET : configuredAsset;

  useEffect(() => {
    const image = imageRef.current;
    if (configuredAsset && pose !== "default" && image?.complete && image.naturalWidth === 0) {
      setFailedPose(pose);
    }
  }, [configuredAsset, pose, src]);

  return (
    <div
      className={`character ${size}${className ? ` ${className}` : ""}`}
      data-pose={pose}
      data-size={size}
      data-fallback={usesFallback ? "true" : undefined}
      role="img"
      aria-label={CHARACTER_LABELS[pose]}
    >
      <img
        ref={imageRef}
        src={src}
        alt=""
        aria-hidden="true"
        onError={() => {
          if (pose !== "default") setFailedPose(pose);
        }}
      />
    </div>
  );
}

export const Character = EconFlowCharacter;
