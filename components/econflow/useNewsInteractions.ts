"use client";

import { useEffect, useRef, useState } from "react";
import type { ExplanationFeedback, NewsComment, NewsSentiment } from "@/lib/news/experience";

export type NewsUser = {
  id: string;
  name: string;
};

export const DEMO_NEWS_USER: NewsUser = {
  id: "local-demo-seoyeon",
  name: "서연",
};

type PersistedNewsInteractions = {
  sentiments: Record<string, NewsSentiment>;
  feedback: Record<string, ExplanationFeedback>;
  commentsByNews: Record<string, NewsComment[]>;
  commentLikes: Record<string, boolean>;
  commentReports: Record<string, boolean>;
};

const STORAGE_KEY = "econflow-news-interactions-v1";

const emptyState: PersistedNewsInteractions = {
  sentiments: {},
  feedback: {},
  commentsByNews: {},
  commentLikes: {},
  commentReports: {},
};

const interactionKey = (newsId: string, userId: string) => `${newsId}:${userId}`;

const createId = () => typeof crypto !== "undefined" && "randomUUID" in crypto
  ? crypto.randomUUID()
  : `comment-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useNewsInteractions(user: NewsUser | null = DEMO_NEWS_USER) {
  const [state, setState] = useState<PersistedNewsInteractions>(emptyState);
  const hydrated = useRef(false);

  useEffect(() => {
    let hydrationTimer: number | undefined;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = { ...emptyState, ...(JSON.parse(saved) as Partial<PersistedNewsInteractions>) };
        hydrationTimer = window.setTimeout(() => {
          hydrated.current = true;
          setState(parsed);
        }, 0);
      } else {
        hydrated.current = true;
      }
    } catch {
      // A blocked or malformed local store must not prevent reading news.
      hydrated.current = true;
    }
    return () => {
      if (hydrationTimer !== undefined) window.clearTimeout(hydrationTimer);
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Interaction state remains available for the current session.
    }
  }, [state]);

  const vote = (newsId: string, sentiment: NewsSentiment) => {
    if (!user) return "auth" as const;
    const key = interactionKey(newsId, user.id);
    if (state.sentiments[key]) return "duplicate" as const;
    setState((current) => ({
      ...current,
      sentiments: { ...current.sentiments, [key]: sentiment },
    }));
    return "ok" as const;
  };

  const rateExplanation = (newsId: string, value: ExplanationFeedback) => {
    if (!user) return "auth" as const;
    const key = interactionKey(newsId, user.id);
    setState((current) => ({
      ...current,
      feedback: { ...current.feedback, [key]: value },
    }));
    return "ok" as const;
  };

  const addComment = (newsId: string, content: string) => {
    if (!user) return "auth" as const;
    const now = new Date().toISOString();
    const comment: NewsComment = {
      id: createId(),
      newsId,
      userId: user.id,
      userName: user.name,
      content: content.trim(),
      likeCount: 0,
      likedBy: [],
      reportedBy: [],
      parentCommentId: null,
      createdAt: now,
      updatedAt: now,
    };
    setState((current) => ({
      ...current,
      commentsByNews: {
        ...current.commentsByNews,
        [newsId]: [...(current.commentsByNews[newsId] ?? []), comment],
      },
    }));
    return "ok" as const;
  };

  const deleteComment = (newsId: string, commentId: string) => {
    if (!user) return;
    setState((current) => ({
      ...current,
      commentsByNews: {
        ...current.commentsByNews,
        [newsId]: (current.commentsByNews[newsId] ?? []).filter((comment) => comment.id !== commentId || comment.userId !== user.id),
      },
    }));
  };

  const toggleCommentLike = (newsId: string, comment: NewsComment) => {
    if (!user) return "auth" as const;
    const key = interactionKey(`${newsId}:${comment.id}:like`, user.id);
    setState((current) => ({
      ...current,
      commentLikes: { ...current.commentLikes, [key]: !current.commentLikes[key] },
    }));
    return "ok" as const;
  };

  const reportComment = (newsId: string, comment: NewsComment) => {
    if (!user) return "auth" as const;
    const key = interactionKey(`${newsId}:${comment.id}:report`, user.id);
    setState((current) => ({
      ...current,
      commentReports: { ...current.commentReports, [key]: true },
    }));
    return "ok" as const;
  };

  const key = user ? interactionKey : null;
  return {
    user,
    sentimentFor: (newsId: string) => user && key ? state.sentiments[key(newsId, user.id)] : undefined,
    feedbackFor: (newsId: string) => user && key ? state.feedback[key(newsId, user.id)] : undefined,
    commentsFor: (newsId: string) => state.commentsByNews[newsId] ?? [],
    isCommentLiked: (newsId: string, commentId: string) => Boolean(user && state.commentLikes[interactionKey(`${newsId}:${commentId}:like`, user.id)]),
    isCommentReported: (newsId: string, commentId: string) => Boolean(user && state.commentReports[interactionKey(`${newsId}:${commentId}:report`, user.id)]),
    vote,
    rateExplanation,
    addComment,
    deleteComment,
    toggleCommentLike,
    reportComment,
  };
}

export type NewsInteractions = ReturnType<typeof useNewsInteractions>;
