import {Interest} from '@/screens/Interest';
import {api} from './apiClient';
import {IToken, setAccessToken, setRefreshToken} from './authApi';

interface Interest {
  id: number;
  name: string;
  image: string;
}

export const getInterests = async () => {
  const {data} = await api.get<Interest[]>('/v1/meta/interests', {}, false);

  return data;
};

export const getGuestAccount = async (interestIds: number[]) => {
  try {
    const {data} = await api.post<IToken>(
      '/v1/members',
      {
        interestIds,
      },
      {},
      false,
    );

    if (!data) return false;

    await setAccessToken(data.token.accessToken);
    await setRefreshToken(data.token.refreshToken);

    return true;
  } catch (e) {
    return false;
  }
};
