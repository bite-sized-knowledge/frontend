import React from 'react';
import {Blog} from '../screens/Blog';
import {createStackNavigator} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FeedTab} from '../screens/Feed';
import {useTheme} from '../context/ThemeContext';

const Stack = createStackNavigator();

export const BStack = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="tabNav"
      screenOptions={{
        headerStyle: {
          height: 56 + insets.top,
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
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
