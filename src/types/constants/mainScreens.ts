export const MAIN_SCREENS = {
  FEED: 'Feed',
  BOOKMARK: 'Bookmark',
  MY: 'My',
} as const;

export type ScreenName = (typeof MAIN_SCREENS)[keyof typeof MAIN_SCREENS];

// RootStack: 앱 전체 흐름 관리 (메인, 회원모달, 로그인 모달 포함)
export type MainTabParamList = {
  [MAIN_SCREENS.FEED]: undefined;
  [MAIN_SCREENS.BOOKMARK]: undefined;
  [MAIN_SCREENS.MY]: undefined;
};
