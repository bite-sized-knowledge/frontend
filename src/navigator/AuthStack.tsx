import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Login} from '@/screens/Login';
import {SignUp} from '@/screens/SignUp';

import {AUTH_SCREENS, AuthStackParamList} from '@/types/constants/authScreens';
import {useRoute} from '@react-navigation/native';
import {ROOT_SCREENS, RootStackParamList} from '@/types/constants/rootScreens';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  const route = useRoute<RootStackParamList, typeof ROOT_SCREENS.AUTH>();
  const showBackButton = route?.params?.showBackButton ?? false;

  return (
    <Stack.Navigator initialRouteName={AUTH_SCREENS.LOGIN}>
      <Stack.Screen
        name={AUTH_SCREENS.LOGIN}
        component={Login}
        options={{headerShown: false}}
        initialParams={{showBackButton}}
      />
      <Stack.Screen
        name={AUTH_SCREENS.SIGN_UP}
        component={SignUp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
