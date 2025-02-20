import { MembersRequest, MembersResponse, Interest, InterestResponse } from '@/types/Interest';
import { BASE_URL } from '@env';

// 관심사 데이터 전송 API 요청
export const postInterest = async (data: MembersRequest): Promise<MembersResponse> => {
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

export const getInterests = async (): Promise<Interest[]> => {
  const response = await fetch(`${BASE_URL}/v1/meta/interests`);
  if (!response.ok) {
    throw new Error('서버에서 데이터를 가져오는 데 실패했습니다.');
  }

  const data: InterestResponse = await response.json();
  if (!data.success || !Array.isArray(data.result)) {
    throw new Error('응답 데이터 형식이 올바르지 않습니다.');
  }

  return data.result;
};