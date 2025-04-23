import {UserInfo} from '@/navigator/RootStack';
import {AUTH_SCREENS} from '@/types/constants/authScreens';
import {MyStackParamList} from '@/types/constants/myScreens';
import {ROOT_SCREENS, RootStackParamList} from '@/types/constants/rootScreens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {createContext, useContext, useState, ReactNode} from 'react';

type AuthContextType = {
  token: UserInfo | null;
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
  setToken: (token: UserInfo | null) => void;
  logout: () => Promise<void>;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState<UserInfo | null>(null);
  const navigation =
    useNavigation<NavigationProp<RootStackParamList & MyStackParamList>>();

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('interestIds');

    setToken(null);
    setLoggedIn(false);

    navigation.reset({
      index: 0,
      routes: [
        {
          name: ROOT_SCREENS.AUTH,
          params: {
            screen: AUTH_SCREENS.LOGIN,
            params: {
              showBackButton: false,
            },
          },
        },
      ],
    });
  };

  return (
    <AuthContext.Provider
      value={{token, setToken, isLoggedIn, setLoggedIn, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
