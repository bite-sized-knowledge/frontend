import { useMutation } from '@tanstack/react-query';
import { postInterest } from '@api/InterestApi';

// React Query의 useMutation 사용
export const usePostInterest = () => {
    return useMutation({
      mutationFn: postInterest,
    });
  };