import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/context/ThemeContext.tsx';
import {BTab} from '@/navigator/BTab.tsx';
import {Login} from '@/screens/Login/index.tsx';
import {SignUp} from '@/screens/SignUp/index.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refreshAccessToken} from '@/api/authApi';

const Stack = createStackNavigator();

export const BStack = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();
  const [initialRouteName, setInitialRouteName] = useState('login');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (accessToken && refreshToken) {
          await refreshAccessToken();
        }

        setInitialRouteName('tabNav');
      } catch (e) {
        setInitialRouteName('login');
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) return <></>;

  return (
    <Stack.Navigator
      // initialRouteName={initialRouteName}
      initialRouteName={'login'}
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
