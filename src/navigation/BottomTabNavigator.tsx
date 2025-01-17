import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ShortList from '../screens/feed/ShortList';
import SavedShortsScreen from '../screens/SavedShortsScreen';
import MyPageScreen from '../screens/MyPageScreen';
import {Text} from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          height: 60,
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Shorts"
        component={ShortList}
        options={{
          tabBarLabel: '쇼츠',
          tabBarIcon: ({color}) => (
            <Text style={{color, fontSize: 24}}>🎬</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SavedShorts"
        component={SavedShortsScreen}
        options={{
          tabBarLabel: '저장됨',
          tabBarIcon: ({color}) => (
            <Text style={{color, fontSize: 24}}>🔖</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({color}) => (
            <Text style={{color, fontSize: 24}}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
