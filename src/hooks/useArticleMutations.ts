import {useMutation} from '@tanstack/react-query';
import {
  addBookmark,
  deleteBookmark,
  like,
  share,
  unlike,
} from '@api/articleApi';

/**
 * 좋아요 API mutation 훅
 * @param articleId 아티클 ID
 * @param onSuccess 성공시 작업할 로직
 */
export const useLikeMutation = (articleId: string, onSuccess: () => void) =>
  useMutation({
    mutationFn: () => like(articleId),
    onSuccess,
  });

/**
 * 좋아요 취소 API mutation 훅
 * @param articleId 아티클 ID
 * @param onSuccess 성공시 작업할 로직
 */
export const useUnlikeMutation = (articleId: string, onSuccess: () => void) =>
  useMutation({mutationFn: () => unlike(articleId), onSuccess});

/**
 * 공유 mutation 훅
 * @param articleId 아티클 ID
 * @param onError 에러시 작업할 로직
 */
export const useShareMutation = (
  articleId: string,
  onError: (error: unknown) => void,
) => useMutation({mutationFn: () => share(articleId), onError});

/**
 * 북마크 API mutation 훅
 * @param articleId 아티클 ID
 * @param onSuccess 성공시 작업할 로직
 */
export const useBookmarkMutation = (articleId: string, onSuccess: () => void) =>
  useMutation({mutationFn: () => addBookmark(articleId), onSuccess});

/**
 * 북마크 취소 API mutation 훅
 * @param articleId 아티클 ID
 * @param onSuccess 성공시 작업할 로직
 */
export const useCancelBookmarkMutation = (
  articleId: string,
  onSuccess: () => void,
) => useMutation({mutationFn: () => deleteBookmark(articleId), onSuccess});
