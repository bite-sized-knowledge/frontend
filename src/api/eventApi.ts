import {api} from './apiClient';

export const TARGET_TYPE = {
  BLOG: 'BLOG',
  ARTICLE: 'ARTICLE',
} as const;

export type TargetType = (typeof TARGET_TYPE)[keyof typeof TARGET_TYPE];

export const EVENT_TYPE = {
  // 피드 노출
  F_IMP: 'F_IMP',
  R_IMP: 'R_IMP', // 추천 게시글 노출
  ARTICLE_IN: 'ARTICLE_IN',
  ARTICLE_OUT: 'ARTICLE_OUT',
  LIKE: 'LIKE',
  LIKE_CANCEL: 'LIKE_CANCEL',
  SHARE: 'SHARE',
  ARCHIVE: 'ARCHIVE',
  ARCHIVE_CANCEL: 'ARCHIVE_CANCEL',
  UNINTEREST: 'UNINTEREST',
  BLOG_IN: 'BLOG_IN',
  BLOG_TO_ARTICLE: 'BLOG_TO_ARTICLE',
  // 블로그 노출
  B_IMP: 'B_IMP',
} as const;

export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

// 요청용 타입
export interface EventRequest {
  targetType: TargetType;
  targetId: string;
  eventType: EventType;
}

export const sendEvent = (
  targetType: TargetType,
  targetId: string,
  eventType: EventType,
) => {
  try {
    api.post('/v1/events', {
      targetType,
      targetId,
      eventType,
    });
  } catch (e) {
    console.log(e);
  }
};
