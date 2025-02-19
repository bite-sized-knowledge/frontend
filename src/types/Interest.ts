import { ApiResponse } from './api/ApiResponse'

// 관심사 API 요청 타입
export interface MembersRequest {
    interestIds: number[];
  }
  
  // 관심사 API 응답 타입
  interface Members {
    memberId: number;
    tokenResponse: {
      accessToken: string;
      refreshToken: string;
    };
  }

export type MembersResponse = ApiResponse<Members>;

interface InterestList {
  id: number;
  name: string;
}

export type InterestResponse = ApiResponse<InterestList[]>