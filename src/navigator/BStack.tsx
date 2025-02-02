import React from 'react';
import {Blog} from '../screens/Blog';
import {createStackNavigator} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FeedTab} from '../screens/Feed';

const Stack = createStackNavigator();

export const BStack = () => {
  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator
      initialRouteName="tabNav"
      screenOptions={{
        headerStyle: {
          height: 56 + insets.top,
        },
      }}>
      <Stack.Screen
        name="tabNav"
        component={FeedTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="blog"
        component={Blog}
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerTitle: '작성자 게시글',
        }}
      />
    </Stack.Navigator>
  );
};
