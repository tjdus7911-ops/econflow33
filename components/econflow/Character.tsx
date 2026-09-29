"use client";

import { useEffect, useRef, useState } from "react";

export type CharacterPose =
  | "default"
  | "up"
  | "down"
  | "news"
  | "study"
  | "curious"
  | "correct"
  | "cheer";

export type CharacterSize = "sm" | "md" | "lg";

export const CHARACTER_FALLBACK_ASSET = "/characters/flow/flow-home.webp";

export const CHARACTER_ASSETS: Record<CharacterPose, string> = {
  default: CHARACTER_FALLBACK_ASSET,
  up: "/characters/flow/flow-research.webp",
  down: "/characters/flow/flow-research.webp",
  news: "/characters/flow/flow-home.webp",
  study: "/characters/flow/flow-study.webp",
  curious: "/characters/flow/flow-research.webp",
  correct: "/characters/flow/flow-success.webp",
  cheer: "/characters/flow/flow-success.webp",
};

const CHARACTER_LABELS: Record<CharacterPose, string> = {
  default: "인사하는 EconFlow 캐릭터 Flow",
  up: "상승 흐름을 분석하는 EconFlow 캐릭터 Flow",
  down: "시장 흐름을 살펴보는 EconFlow 캐릭터 Flow",
  news: "경제 흐름을 설명하는 EconFlow 캐릭터 Flow",
  study: "책을 읽으며 공부하는 EconFlow 캐릭터 Flow",
  curious: "경제 데이터를 분석하는 EconFlow 캐릭터 Flow",
  correct: "학습 완료를 축하하는 EconFlow 캐릭터 Flow",
  cheer: "학습을 응원하는 EconFlow 캐릭터 Flow",
};

export function Character({
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
