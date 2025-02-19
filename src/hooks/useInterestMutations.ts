import { useMutation } from '@tanstack/react-query';
import { postInterest } from '@/api/InterestApi';
import { MembersRequest } from '@/types/Interest';

/**
 * 관심사 데이터 전송 API mutation 훅
 * @param onSuccess 성공 시 작업할 로직
 * @param onError 에러 시 작업할 로직
 */
export const usePostInterest = (onSuccess: (data: any) => void, onError: (error: any) => void) =>
  useMutation({
    mutationFn: postInterest,
    onSuccess,
    onError,
  });
