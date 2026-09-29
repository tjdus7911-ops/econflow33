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

export const CHARACTER_FALLBACK_ASSET = "/characters/nami-default.png";

export const CHARACTER_ASSETS: Record<CharacterPose, string> = {
  default: CHARACTER_FALLBACK_ASSET,
  up: CHARACTER_FALLBACK_ASSET,
  down: CHARACTER_FALLBACK_ASSET,
  news: CHARACTER_FALLBACK_ASSET,
  study: CHARACTER_FALLBACK_ASSET,
  curious: CHARACTER_FALLBACK_ASSET,
  correct: CHARACTER_FALLBACK_ASSET,
  cheer: CHARACTER_FALLBACK_ASSET,
};

const CHARACTER_LABELS: Record<CharacterPose, string> = {
  default: "인사하는 EconFlow 캐릭터 나미",
  up: "상승 흐름을 안내하는 EconFlow 캐릭터 나미",
  down: "하락 흐름을 살펴보는 EconFlow 캐릭터 나미",
  news: "경제 뉴스를 설명하는 EconFlow 캐릭터 나미",
  study: "경제를 공부하는 EconFlow 캐릭터 나미",
  curious: "경제 개념을 생각하는 EconFlow 캐릭터 나미",
  correct: "정답과 학습 완료를 축하하는 EconFlow 캐릭터 나미",
  cheer: "학습을 응원하는 EconFlow 캐릭터 나미",
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
