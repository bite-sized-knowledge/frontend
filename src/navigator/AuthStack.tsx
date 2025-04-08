import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Login} from '@/screens/Login';
import {SignUp} from '@/screens/SignUp';

import {AUTH_SCREENS, AuthStackParamList} from '@/types/constants/authScreens';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName={AUTH_SCREENS.LOGIN}>
      <Stack.Screen
        name={AUTH_SCREENS.LOGIN}
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={AUTH_SCREENS.SIGN_UP}
        component={SignUp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
