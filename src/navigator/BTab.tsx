import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {Feed} from '../screens/Feed';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export const BTab = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="HOME"
      screenOptions={() => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          height: 64 + insets.bottom,
        },
        headerStyle: {height: 56 + insets.top}, // 헤더 높이 조정
      })}>
      <Tab.Screen name="HOME" component={Feed} />
      <Tab.Screen name="BITE" component={() => <Text>BITE</Text>} />
      <Tab.Screen name="MY" component={() => <Text>MY</Text>} />
    </Tab.Navigator>
  );
};
