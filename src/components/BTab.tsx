import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ElevationExample} from '../screens/example/ElevationExample';
import {Text} from 'react-native';

const Tab = createBottomTabNavigator();
export const BTab = () => {
  return (
    <Tab.Navigator initialRouteName="HOME">
      <Tab.Screen name="HOME" component={ElevationExample} />
      <Tab.Screen name="BITE" component={() => <Text>BITE</Text>} />
      <Tab.Screen name="MY" component={() => <Text>MY</Text>} />
    </Tab.Navigator>
  );
};
