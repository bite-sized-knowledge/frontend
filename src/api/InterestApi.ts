import {api} from '@api/apiClient'
import { MembersRequest, MembersResponse, InterestResponse } from '@/types/Interest';

// 관심사 데이터 전송 API 요청
export const postInterest = async (requestBody: MembersRequest) => {
  const data = await api.post<MembersResponse>('/v1/members', requestBody)

  return data;
};

// 관심사 목록 API 받기
export const getInterest = async() => {
  const data = await api.get<InterestResponse>('/v1/meta/interests')

  return data
}