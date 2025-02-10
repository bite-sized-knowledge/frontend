import {BASE_URL} from '@env';
import {getAccessToken, refreshAccessToken} from './authApi';

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
  ): Promise<{data: T | null; error: Error | null; status: number}> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const accessToken = await getAccessToken();

      const headers = {
        ...this.defaultHeaders,
        ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
        ...options.headers,
      };

      const response = await this.fetchWithTimeout(url, {
        ...options,
        headers,
      });

      // 만약 토큰이 만료되었을 경우 (401 Unauthorized), 리프레시 토큰으로 새로운 액세스 토큰을 발급받고 다시 요청
      if (response.status === 401) {
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

      const data = await response.json().catch(() => null);

      return {
        data: response.ok ? (data as T) : null,
        error: response.ok
          ? null
          : new Error(
              (data?.message as string) || '네트워크 에러가 발생했습니다',
            ),
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error:
          error instanceof Error
            ? error
            : new Error('알 수 없는 에러가 발생했습니다'),
        status: 500,
      };
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, {...options, method: 'GET'});
  }

  async post<T>(endpoint: string, body: unknown, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, {...options, method: 'DELETE'});
  }
}

export const api = new ApiClient();
