import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useTheme} from '../context/ThemeContext';
import Icons from '@/assets/icons';
import {elevation} from '@/styles/tokens/elevation';

import {MyStack} from './MyStack';
import {useAuth} from '@/hooks/useAuth';
import {MAIN_SCREENS, MainTabParamList} from '@/types/constants/mainScreens';
import {ROOT_SCREENS, RootStackParamList} from '@/types/constants/rootScreens';
import {FeedStack} from './FeedStack';
import {BookmarkStack} from './BookmarkStack';

const Tab = createBottomTabNavigator<MainTabParamList & RootStackParamList>();

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
  theme: Theme;
}

const TabBarIcon = React.memo(
  ({routeName, focused, theme}: TabBarIconProps) => {
    switch (routeName) {
      case MAIN_SCREENS.FEED:
        return focused ? (
          <Icons.HomeFill color={theme.text} />
        ) : (
          <Icons.HomeDefault color={theme.text} />
        );
      case MAIN_SCREENS.BOOKMARK:
        return focused ? (
          <Icons.CookieBoxFill
            color={theme.text}
            fillSecondary={theme.background}
          />
        ) : (
          <Icons.CookieBoxDefault color={theme.text} />
        );
      case MAIN_SCREENS.MY:
        return focused ? (
          <Icons.MyFill color={theme.text} />
        ) : (
          <Icons.MyDefault color={theme.text} />
        );
      default:
        return null;
    }
  },
);

export const MainTab = () => {
  const insets = useSafeAreaInsets();
  const {theme, themeMode} = useTheme();
  const {isLoggedIn} = useAuth();

  return (
    <Tab.Navigator
      initialRouteName={MAIN_SCREENS.FEED}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          height: 64 + insets.bottom,
          paddingTop: 20,
          borderTopLeftRadius: themeMode === 'light' ? 20 : 0,
          borderTopRightRadius: themeMode === 'light' ? 20 : 0,
          borderColor: themeMode === 'dark' ? theme.background : 'transparent', // 다크 모드에서는 테두리 제거
          backgroundColor: theme.background, // 배경색 명확하게 설정
          borderWidth: themeMode === 'dark' ? 0 : 1, // 다크 모드에서 보더 제거
          ...(themeMode === 'light' ? elevation.gnb : {}), // 라이트 모드일 때만 GNB 스타일 적용
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused}) => (
          <TabBarIcon routeName={route.name} focused={focused} theme={theme} />
        ),
      })}>
      <Tab.Screen name={MAIN_SCREENS.FEED} component={FeedStack} />
      <Tab.Screen
        name={MAIN_SCREENS.BOOKMARK}
        component={BookmarkStack}
        listeners={({navigation}) => ({
          tabPress: e => {
            if (!isLoggedIn) {
              e.preventDefault();
              // 로그인되지 않은 경우, 회원 전용 모달을 띄움
              navigation.navigate(ROOT_SCREENS.AUTH_MODAL);
            }
          },
        })}
      />
      <Tab.Screen
        name={MAIN_SCREENS.MY}
        component={MyStack}
        listeners={({navigation}) => ({
          tabPress: e => {
            if (!isLoggedIn) {
              e.preventDefault();
              // 로그인되지 않은 경우, 회원 전용 모달을 띄움
              navigation.navigate(ROOT_SCREENS.AUTH_MODAL);
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};
