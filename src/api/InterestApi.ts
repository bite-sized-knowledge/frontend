import {api} from '@api/apiClient'
import { InterestResponse, InterestRequest } from '@/types/Interest';
import { BASE_URL } from '@env';

// 관심사 데이터 전송 API 요청
export const postInterest = async (data: InterestRequest): Promise<InterestResponse> => {
  const response = await fetch(`${BASE_URL}/v1/members`, {
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