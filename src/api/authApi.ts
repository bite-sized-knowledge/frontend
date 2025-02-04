import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@env';

// accessToken을 AsyncStorage에서 가져오는 함수
export const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};

// refreshToken을 AsyncStorage에서 가져오는 함수
export const getRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('refreshToken');
};

// refreshToken을 이용하여 새로운 accessToken을 발급받는 함수
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error('Refresh token not available');
  }

  // 리프레시 토큰으로 새로운 access token을 발급 받는 API 호출
  try {
    const response = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({refreshToken}),
    });

    const data = await response.json();

    if (data.success && data.result.accessToken) {
      // 새로운 access token 저장
      await AsyncStorage.setItem('accessToken', data.result.accessToken);
      return data.result.accessToken;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing access token', error);
    throw new Error('Failed to refresh token');
  }
};
