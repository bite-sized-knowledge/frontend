import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '@env';
import {api} from './apiClient';

// accessToken을 AsyncStorage에서 가져오는 함수
export const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};

// refreshToken을 AsyncStorage에서 가져오는 함수
export const getRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('refreshToken');
};

export const setAccessToken = async (accessToken: string) => {
  return await AsyncStorage.setItem('accessToken', accessToken);
};
export const setRefreshToken = async (refreshToken: string) => {
  return await AsyncStorage.setItem('refreshToken', refreshToken);
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

export interface IToken {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * 로그인
 * @param email 이메일
 * @param password 비밀번호
 */
export const login = async (email: string, password: string) => {
  try {
    console.log(email, password);
    const {data, error} = await api.post<IToken>('/v1/auth/login', {
      email,
      password,
    });

    if (!error && data) {
      await AsyncStorage.setItem('accessToken', data.token.accessToken);
      await AsyncStorage.setItem('refreshToken', data.token.refreshToken);

      return true;
    }

    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');

    return false;
  } catch (e) {
    return false;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('interestIds');
};

export const authenticationEmail = async (email: string) => {
  return await api.post('/v1/auth/email/request-verify', {
    email,
  });
};

export const verifyEmail = async (email: string): Promise<boolean> => {
  try {
    const {data} = await api.get<boolean>(
      `/v1/auth/email/is-verified?email=${email}`,
    );

    return data ?? false;
  } catch (e) {
    return false;
  }
};

export const checkNameDuplication = async (name: string) => {
  try {
    const {error} = await api.get(`/v1/members/name/check?name=${name}`);

    return error === null;
  } catch (e) {
    return false;
  }
};

interface signUpParam {
  email: string;
  password: string;
  // name: string;
  birth: number;
}

export const signUp = async ({email, password, birth}: signUpParam) => {
  try {
    const {data, error} = await api.post('/v1/members/join', {
      email,
      password,
      // name,
      birth,
    });

    if (!error && data) {
      await AsyncStorage.setItem('accessToken', data.token.accessToken);
      await AsyncStorage.setItem('refreshToken', data.token.refreshToken);

      return true;
    }

    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');

    return false;
  } catch (e) {
    return false;
  }
};
