"use client";

import { useEffect, useRef, useState } from "react";

export type CharacterPose =
  | "default"
  | "study"
  | "news"
  | "research"
  | "market"
  | "success"
  | "thinking"
  | "notification"
  | "waiting"
  | "welcome"
  | "empty"
  | "up"
  | "down"
  | "curious"
  | "correct"
  | "cheer";

export type CharacterSize = "sm" | "md" | "lg";

export const CHARACTER_FALLBACK_ASSET = "/characters/econflow-default.png";

export const CHARACTER_ASSETS: Record<CharacterPose, string> = {
  default: CHARACTER_FALLBACK_ASSET,
  study: "/characters/econflow-study.png",
  news: "/characters/econflow-news.png",
  research: "/characters/econflow-research.png",
  market: "/characters/econflow-market.png",
  success: "/characters/econflow-success.png",
  thinking: "/characters/econflow-thinking.png",
  notification: "/characters/econflow-notification.png",
  waiting: "/characters/econflow-waiting.png",
  welcome: "/characters/econflow-welcome.png",
  empty: "/characters/econflow-empty.png",
  up: "/characters/econflow-market.png",
  down: "/characters/econflow-market.png",
  curious: "/characters/econflow-thinking.png",
  correct: "/characters/econflow-success.png",
  cheer: "/characters/econflow-welcome.png",
};

const CHARACTER_LABELS: Record<CharacterPose, string> = {
  default: "인사하는 EconFlow 캐릭터 Flow",
  study: "책을 읽으며 공부하는 EconFlow 캐릭터 Flow",
  news: "신문을 읽는 EconFlow 캐릭터 Flow",
  research: "기업과 산업을 탐색하는 EconFlow 캐릭터 Flow",
  market: "시장 흐름을 설명하는 EconFlow 캐릭터 Flow",
  success: "학습 완료를 축하하는 EconFlow 캐릭터 Flow",
  thinking: "경제 개념을 고민하는 EconFlow 캐릭터 Flow",
  notification: "알림을 확인하는 EconFlow 캐릭터 Flow",
  waiting: "잠시 기다리는 EconFlow 캐릭터 Flow",
  welcome: "반짝이며 환영하는 EconFlow 캐릭터 Flow",
  empty: "아쉬운 표정의 EconFlow 캐릭터 Flow",
  up: "시장 흐름을 설명하는 EconFlow 캐릭터 Flow",
  down: "시장 흐름을 설명하는 EconFlow 캐릭터 Flow",
  curious: "경제 개념을 고민하는 EconFlow 캐릭터 Flow",
  correct: "학습 완료를 축하하는 EconFlow 캐릭터 Flow",
  cheer: "반짝이며 환영하는 EconFlow 캐릭터 Flow",
};

export function EconFlowCharacter({
  pose = "default",
  size = "md",
  className = "",
}: {
  pose?: CharacterPose;
  size?: CharacterSize;
  className?: string;
}) {
  const [failedPose, setFailedPose] = useState<CharacterPose | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const usesFallback = pose !== "default" &&
    (CHARACTER_ASSETS[pose] === CHARACTER_FALLBACK_ASSET || failedPose === pose);
  const src = usesFallback ? CHARACTER_FALLBACK_ASSET : CHARACTER_ASSETS[pose];

  useEffect(() => {
    const image = imageRef.current;
    if (pose !== "default" && image?.complete && image.naturalWidth === 0) {
      setFailedPose(pose);
    }
  }, [pose, src]);

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
