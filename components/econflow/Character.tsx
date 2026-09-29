"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 돈똑이 공식 Character Guide의 24개 포즈와 기존 화면 호환 별칭을
 * 하나의 vocabulary로 관리합니다. 화면에서는 파일 경로를 직접 쓰지 않고
 * 이 pose만 전달합니다.
 */
export type CharacterPose =
  | "observe"
  | "curious"
  | "discover"
  | "check"
  | "joy"
  | "study"
  | "analyze"
  | "start"
  | "basic"
  | "wink"
  | "surprise"
  | "question"
  | "think"
  | "excited"
  | "embarrassed"
  | "focus"
  | "happy"
  | "sad"
  | "coffee"
  | "shopping"
  | "news"
  | "market"
  | "money"
  | "aha"
  // Existing screen aliases retained so this is a safe drop-in replacement.
  | "observer"
  | "research"
  | "surprised"
  | "thinking"
  | "confused"
  | "success"
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

const DONDDOKI_ASSET_ROOT = "/characters/donddoki";
export const CHARACTER_FALLBACK_ASSET = `${DONDDOKI_ASSET_ROOT}/basic.png`;

const asset = (pose: Exclude<CharacterPose, "observer" | "research" | "surprised" | "thinking" | "confused" | "success" | "waiting" | "empty" | "default" | "notification" | "welcome" | "up" | "down" | "correct" | "cheer">) => `${DONDDOKI_ASSET_ROOT}/${pose}.png`;

export const CHARACTER_ASSETS: Record<CharacterPose, string> = {
  observe: asset("observe"),
  curious: asset("curious"),
  discover: asset("discover"),
  check: asset("check"),
  joy: asset("joy"),
  study: asset("study"),
  analyze: asset("analyze"),
  start: asset("start"),
  basic: asset("basic"),
  wink: asset("wink"),
  surprise: asset("surprise"),
  question: asset("question"),
  think: asset("think"),
  excited: asset("excited"),
  embarrassed: asset("embarrassed"),
  focus: asset("focus"),
  happy: asset("happy"),
  sad: asset("sad"),
  coffee: asset("coffee"),
  shopping: asset("shopping"),
  news: asset("news"),
  market: asset("market"),
  money: asset("money"),
  aha: asset("aha"),

  // Backward-compatible aliases for screens that still use the earlier names.
  observer: asset("observe"),
  research: asset("analyze"),
  surprised: asset("surprise"),
  thinking: asset("think"),
  confused: asset("question"),
  success: asset("joy"),
  waiting: asset("basic"),
  empty: asset("sad"),
  default: asset("basic"),
  notification: asset("check"),
  welcome: asset("happy"),
  up: asset("market"),
  down: asset("market"),
  correct: asset("joy"),
  cheer: asset("joy"),
};

const CHARACTER_LABELS: Record<CharacterPose, string> = {
  observe: "경제를 관찰하는 돈똑이",
  curious: "궁금한 점을 살펴보는 돈똑이",
  discover: "경제 흐름을 발견한 돈똑이",
  check: "데이터를 확인하는 돈똑이",
  joy: "기뻐하는 돈똑이",
  study: "책을 읽으며 공부하는 돈똑이",
  analyze: "데이터를 분석하는 돈똑이",
  start: "EconFlow를 시작하는 돈똑이",
  basic: "돈똑이 기본 표정",
  wink: "윙크하는 돈똑이",
  surprise: "새로운 경제 현상에 놀란 돈똑이",
  question: "궁금한 점을 묻는 돈똑이",
  think: "경제 개념을 고민하는 돈똑이",
  excited: "신나하는 돈똑이",
  embarrassed: "잠시 당황한 돈똑이",
  focus: "경제 데이터를 집중해서 보는 돈똑이",
  happy: "행복해하는 돈똑이",
  sad: "조금 아쉬워하는 돈똑이",
  coffee: "물가를 살펴보는 돈똑이",
  shopping: "소비자물가를 살펴보는 돈똑이",
  news: "경제 뉴스를 살펴보는 돈똑이",
  market: "주식과 시장을 살펴보는 돈똑이",
  money: "금리와 환율을 살펴보는 돈똑이",
  aha: "경제 개념을 이해한 돈똑이",
  observer: "경제를 관찰하는 돈똑이",
  research: "기업과 산업을 분석하는 돈똑이",
  surprised: "새로운 경제 현상에 놀란 돈똑이",
  thinking: "경제 개념을 고민하는 돈똑이",
  confused: "어려운 경제 개념을 살펴보는 돈똑이",
  success: "학습 완료를 축하하는 돈똑이",
  waiting: "데이터를 기다리는 돈똑이",
  empty: "아쉬운 표정의 돈똑이",
  default: "돈똑이",
  notification: "알림을 확인하는 돈똑이",
  welcome: "환영하는 돈똑이",
  up: "상승하는 시장을 보는 돈똑이",
  down: "하락하는 시장을 보는 돈똑이",
  correct: "정답을 맞힌 돈똑이",
  cheer: "응원하는 돈똑이",
};

export function EconFlowCharacter({
  pose = "observe",
  size = "md",
  className = "",
  alt,
}: {
  pose?: CharacterPose;
  size?: CharacterSize;
  className?: string;
  alt?: string;
}) {
  const [failedPose, setFailedPose] = useState<CharacterPose | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const src = failedPose === pose ? CHARACTER_FALLBACK_ASSET : CHARACTER_ASSETS[pose];
  const usesFallback = failedPose === pose;

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) setFailedPose(pose);
  }, [pose, src]);

  return (
    <div
      className={`character ${size}${className ? ` ${className}` : ""}`}
      data-pose={pose}
      data-size={size}
      data-fallback={usesFallback ? "true" : undefined}
      role="img"
      aria-label={alt || CHARACTER_LABELS[pose]}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt || ""}
        aria-hidden={alt ? undefined : "true"}
        onError={() => setFailedPose(pose)}
      />
    </div>
  );
}

export const Character = EconFlowCharacter;
