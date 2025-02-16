import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';
import {FeedStack, FeedTab} from './FeedTab';
import Icons from '@/assets/icons';
import {elevation} from '@/styles/tokens/elevation';

const Tab = createBottomTabNavigator();

export const BTab = () => {
  const insets = useSafeAreaInsets();
  const {theme, themeMode} = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HOME"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          height: 64 + insets.bottom,
          paddingTop: 20,
          borderRadius: themeMode === 'light' ? 20 : 0, // 라이트 모드에서만 둥글게
          borderColor: themeMode === 'dark' ? theme.background : 'transparent', // 다크 모드에서는 테두리 제거
          backgroundColor: theme.background, // 배경색 명확하게 설정
          borderWidth: themeMode === 'dark' ? 0 : 1, // 다크 모드에서 보더 제거
          ...(themeMode === 'light' ? elevation.gnb : {}), // 라이트 모드일 때만 GNB 스타일 적용
        },
        tabBarIcon: ({focused}) => {
          switch (route.name) {
            case 'HOME':
              return focused ? (
                <Icons.HomeFill color={theme.text} />
              ) : (
                <Icons.HomeDefault color={theme.text} />
              );
            case 'BITE':
              return focused ? (
                <Icons.CookieBoxFill
                  color={theme.text}
                  fillSecondary={theme.background}
                />
              ) : (
                <Icons.CookieBoxDefault color={theme.text} />
              );
            case 'MY':
              return focused ? (
                <Icons.MyFill color={theme.text} />
              ) : (
                <Icons.MyDefault color={theme.text} />
              );
          }
        },
      })}>
      {/* <Tab.Screen name="HOME" component={FeedTab} /> */}
      <Tab.Screen name="HOME" component={FeedStack} />
      <Tab.Screen name="BITE" component={() => <Text>BITE</Text>} />
      <Tab.Screen name="MY" component={() => <Text>MY</Text>} />
    </Tab.Navigator>
  );
};
