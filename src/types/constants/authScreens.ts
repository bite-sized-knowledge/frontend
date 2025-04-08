// src/constants/screens.ts
export const AUTH_SCREENS = {
  LOGIN: 'Login',
  SIGN_UP: 'SignUp',
} as const;

export type ScreenName = (typeof AUTH_SCREENS)[keyof typeof AUTH_SCREENS];

// AuthStack: 로그인 및 회원가입 플로우
export type AuthStackParamList = {
  [AUTH_SCREENS.LOGIN]: undefined;
  [AUTH_SCREENS.SIGN_UP]: undefined;
};
