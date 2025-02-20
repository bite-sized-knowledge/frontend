//Interest.ts

export interface MembersRequest {
  interestIds: number[];
}

// 관심사 API 응답 타입
export interface MembersResponse {
  success: boolean;
  result: {
    memberId: number;
    tokenResponse: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

// 관심사 데이터 요청 API 함수
export interface Interest {
  id: number;
  name: string;
}

export interface InterestResponse {
  success: boolean;
  result: Interest[];
}