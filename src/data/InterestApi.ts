import {useMutation} from '@tanstack/react-query';
import {InterestRequest, InterestResponse} from '../types/api/Interest';

const API_URL = 'https://api.bite-knowledge.com/v1/members';

// 관심사 데이터 전송 API 요청
export const postInterest = async (
  data: InterestRequest,
): Promise<InterestResponse> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('서버 응답이 실패했습니다.');
  }

  return response.json();
};

// React Query의 useMutation 사용
export const usePostInterest = data => {
  return useMutation({
    mutationFn: () => postInterest(data),
  });
};
