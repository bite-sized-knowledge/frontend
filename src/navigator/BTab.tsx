import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';
import {FeedTab} from './FeedTab';

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
        headerShown: false,
      })}>
      <Tab.Screen name="HOME" component={FeedTab} />
      <Tab.Screen name="BITE" component={() => <Text>BITE</Text>} />
      <Tab.Screen name="MY" component={() => <Text>MY</Text>} />
    </Tab.Navigator>
  );
};
