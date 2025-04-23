import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/context/ThemeContext.tsx';
import {MainTab} from '@/navigator/MainTab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Interest} from '@/screens/Interest';
import {AuthStack} from './AuthStack';
import {ScreenName, ROOT_SCREENS} from '@/types/constants/rootScreens';
import MemberModal from '@/screens/MemberModal';
import {refreshAccessToken} from '@/api/authApi';
import {useAuth} from '@/hooks/useAuth';
import {jwtDecode, JwtPayload} from 'jwt-decode';

const Stack = createStackNavigator();

export interface UserInfo extends JwtPayload {
  birth?: number;
  email?: string;
  name?: string;
  id?: number;
  role?: 'ROLE_USER' | 'ROLE_GUEST';
  status?: string;
}

export const RootStack = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();
  const [initialRouteName, setInitialRouteName] = useState<ScreenName>(
    ROOT_SCREENS.INTEREST,
  );
  const [isLoading, setIsLoading] = useState(true);
  const {setLoggedIn, setToken} = useAuth();

  useEffect(() => {
    setIsLoading(true);
    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          await refreshAccessToken();
        } else {
          setLoggedIn(false);
          setInitialRouteName(ROOT_SCREENS.INTEREST);
          return;
        }

        const decoded = jwtDecode<UserInfo>(accessToken);

        // 비회원/회원 판별
        if (decoded.role !== 'ROLE_GUEST') {
          setLoggedIn(true);
          setToken(decoded);
        } else {
          setLoggedIn(false);
        }

        setInitialRouteName(ROOT_SCREENS.MAIN);
      } catch (e) {
        setLoggedIn(false);
        setInitialRouteName(ROOT_SCREENS.INTEREST);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) return <></>;

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      // initialRouteName={ROOT_SCREENS.INTEREST}
      screenOptions={{
        headerStyle: {
          height: 56 + insets.top,
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        presentation: 'card',
      }}>
      <Stack.Screen
        name={ROOT_SCREENS.INTEREST}
        component={Interest}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ROOT_SCREENS.MAIN}
        component={MainTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ROOT_SCREENS.AUTH}
        component={AuthStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ROOT_SCREENS.AUTH_MODAL}
        component={MemberModal}
        options={{headerShown: false, presentation: 'transparentModal'}}
      />
    </Stack.Navigator>
  );
};
