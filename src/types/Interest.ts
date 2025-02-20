//Interest.ts

export interface InterestRequest {
  interestIds: number[];
}

// 관심사 API 응답 타입
export interface InterestResponse {
  success: boolean;
  result: {
    memberId: number;
    tokenResponse: {
      accessToken: string;
      refreshToken: string;
    };
  };
}