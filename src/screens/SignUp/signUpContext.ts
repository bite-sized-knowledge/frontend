export type 관심주제선택 = {
  email?: string;
  password?: string;
  name?: string;
  birthYear?: number;
};
export type 이메일입력 = {
  email?: string;
  password?: string;
  name?: string;
  birthYear?: number;
};
export type 비밀번호입력 = {
  email: string;
  password?: string;
  name?: string;
  birthYear?: number;
};
export type 이름입력 = {
  email: string;
  password: string;
  name?: string;
  birthYear?: number;
};
export type 생년입력 = {
  email: string;
  password: string;
  name: string;
  birthYear?: number;
};
export type 약관동의 = {
  email: string;
  password: string;
  name: string;
  birthYear?: number;
};
export type 가입환영 = {
  email: string;
  password: string;
  name: string;
  birthYear: number;
};

export const navigationParamName = '__useFunnelState';

export type NativeFunnelState = {
  step?: string;
  context?: any;
  index: number;
  histories?: any[];
  isOverlay?: boolean;
  routeKey?: string;
};

export type NativeFunnelParam = {
  [navigationParamName]?: Record<string, NativeFunnelState>;
};

export type NativeFunnelParamList = Record<string, NativeFunnelParam>;
