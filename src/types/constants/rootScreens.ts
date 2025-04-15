// src/constants/screens.ts
export const ROOT_SCREENS = {
  INTEREST: 'Interest',
  AUTH: 'Auth',
  AUTH_MODAL: 'AuthModal',
  MAIN: 'Main',
} as const;

export type ScreenName = (typeof ROOT_SCREENS)[keyof typeof ROOT_SCREENS];

// RootStack: 앱 전체 흐름 관리 (메인, 회원모달, 로그인 모달 포함)
export type RootStackParamList = {
  [ROOT_SCREENS.INTEREST]: undefined;
  [ROOT_SCREENS.AUTH]?: {showBackButton?: boolean};
  [ROOT_SCREENS.AUTH_MODAL]: undefined;
  [ROOT_SCREENS.MAIN]: undefined;
};
