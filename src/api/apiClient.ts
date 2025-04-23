import {BASE_URL} from '@env';
import {getAccessToken, refreshAccessToken} from './authApi';
import {ApiResponse} from '@/types/api/ApiResponse';

// TODO: 에러 형식 맞추기
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit & {timeout?: number},
  ): Promise<Response> {
    const {timeout = 99999999999, ...fetchOptions} = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    authRequired: boolean = true,
  ): Promise<{data: T | null; error: Error | null; status: boolean}> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      let accessToken: string | null = null;
      if (authRequired) {
        accessToken = await getAccessToken();
      }

      const headers = {
        ...this.defaultHeaders,
        ...(authRequired && accessToken
          ? {Authorization: `Bearer ${accessToken}`}
          : {}),
        ...options.headers,
      };

      const response = await this.fetchWithTimeout(url, {
        ...options,
        headers,
      });

      // 만약 토큰이 만료되었을 경우 (401 Unauthorized), 리프레시 토큰으로 새로운 액세스 토큰을 발급받고 다시 요청
      if (authRequired && response.status === 401) {
        const newAccessToken = await refreshAccessToken();

        // 새 토큰으로 재요청
        return this.request<T>(endpoint, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      }

      console.log(url, options);

      const data = (await response.json().catch(() => null)) as ApiResponse<T>;

      if (data) {
        return {
          data: data.result,
          error: null,
          status: data.success,
        };
      }

      return {
        data: null,
        error: new Error('네트워크 에러가 발생했습니다'),
        status: false,
      };
    } catch (error) {
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error('알 수 없는 에러가 발생했습니다'),
        status: false,
      };
    }
  }

  async get<T>(
    endpoint: string,
    options: RequestInit = {},
    authRequired = true,
  ) {
    return this.request<T>(endpoint, {...options, method: 'GET'}, authRequired);
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit = {},
    authRequired = true,
  ) {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
      },
      authRequired,
    );
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit = {},
    authRequired = true,
  ) {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
      },
      authRequired,
    );
  }

  async delete<T>(
    endpoint: string,
    options: RequestInit = {},
    authRequired = true,
  ) {
    return this.request<T>(
      endpoint,
      {...options, method: 'DELETE'},
      authRequired,
    );
  }
}

export const api = new ApiClient();
