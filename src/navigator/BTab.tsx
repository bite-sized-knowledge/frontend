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
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'black',
          alignItems: 'center',
          height: 64 + insets.bottom,
        },
        // tabBarIcon: ({focused}) => (
        //   <TabBarIcon focused={focused} route={route} />
        // ),
        headerStyle: {height: 56 + insets.top}, // 헤더 높이 조정
        headerShown: true, // 필요 시 false로 설정해 헤더 숨김
      })}>
      <Tab.Screen name="HOME" component={Feed} />
      <Tab.Screen name="BITE" component={() => <Text>BITE</Text>} />
      <Tab.Screen name="MY" component={() => <Text>MY</Text>} />
    </Tab.Navigator>
  );
};
