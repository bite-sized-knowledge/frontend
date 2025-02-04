import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {Feed} from '../screens/Feed';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export const BTab = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HOME"
      screenOptions={() => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          height: 64 + insets.bottom,
          backgroundColor: theme.background,
        },
        headerStyle: {
          height: 56 + insets.top,
          backgroundColor: theme.background,
        }, // 헤더 높이 조정
        headerTintColor: theme.text,
      })}>
      <Tab.Screen name="HOME" component={Feed} />
      <Tab.Screen name="BITE" component={() => <Text>BITE</Text>} />
      <Tab.Screen name="MY" component={() => <Text>MY</Text>} />
    </Tab.Navigator>
  );
};
