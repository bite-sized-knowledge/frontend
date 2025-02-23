import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/context/ThemeContext.tsx';
import {BTab} from '@/navigator/BTab.tsx';
import {Login} from '@/screens/Login/index.tsx';
import {SignUp} from '@/screens/SignUp/index.tsx';

const Stack = createStackNavigator();

export const BStack = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        headerStyle: {
          height: 56 + insets.top,
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}>
      <Stack.Screen
        name="tabNav"
        component={BTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="signUp"
        component={SignUp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
