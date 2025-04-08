import {JWT} from '@/screens/My';

// src/constants/screens.ts
export const MY_SCREENS = {
  MY_PROFILE: 'Login',
  MY_DETAIL: 'SignUp',
  WITHDRAW: 'Withdraw',
  WITHDRAW_DETAIL: 'WithdrawDetail',
} as const;

export type ScreenName = (typeof MY_SCREENS)[keyof typeof MY_SCREENS];

// MYStack: 로그인 및 회원가입 플로우
export type MyStackParamList = {
  [MY_SCREENS.MY_PROFILE]: undefined;
  [MY_SCREENS.MY_DETAIL]: {jwtPayload: JWT};
  [MY_SCREENS.WITHDRAW]: undefined;
  [MY_SCREENS.WITHDRAW_DETAIL]: undefined;
};
