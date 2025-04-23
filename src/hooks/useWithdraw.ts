import {withDraw} from '@/api/authApi';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuth} from './useAuth';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ROOT_SCREENS, RootStackParamList} from '@/types/constants/rootScreens';

export const useWithdraw = () => {
  const {token, setLoggedIn, setToken} = useAuth();
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return useMutation({
    mutationFn: () => {
      console.log(token);
      if (!token?.sub) {
        return Promise.reject(new Error('유저 id가 없습니다.'));
      }

      return withDraw(token.sub);
    },
    onSuccess: async () => {
      // 캐시 초기화
      queryClient.clear();

      // 토큰 삭제
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');

      setToken(null);
      setLoggedIn(false);

      // 로그인 화면으로 리셋 네비게이션
      navigation.reset({
        index: 0,
        routes: [{name: ROOT_SCREENS.AUTH}],
      });
    },
  });
};
