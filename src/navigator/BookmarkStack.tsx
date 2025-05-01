import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/context/ThemeContext.tsx';
import {Bookmark} from '@/screens/Bookmark';
import {BookmarkFeed} from '@/screens/Bookmark/BookmarkFeed';

const Stack = createStackNavigator();

export const BookmarkStack = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={'bookmark'}
      screenOptions={{
        headerStyle: {
          height: 56 + insets.top,
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}>
      <Stack.Screen
        name={'bookmark'}
        component={Bookmark}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'bookmarkFeed'}
        component={BookmarkFeed}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
