import {authenticationEmail, checkNameDuplication} from '@/api/authApi';
import {useMutation} from '@tanstack/react-query';

/**
 * 이메일 인증 전송 API
 * @param email 이메일
 * @param onSuccess 성공시 작업할 로직
 * @param onError 실패시 작업할 로직
 */
export const useAuthenticateEmail = (
  email: string,
  onSuccess: () => void,
  onError: (err: string) => void,
) =>
  useMutation({
    mutationFn: () => authenticationEmail(email),
    onSuccess,
    onError,
  });

/**
 * 이름 중복 확인 API
 * @param name 이름
 * @param onSuccess 성공시 작업할 로직
 * @param onError 실패시 작업할 로직
 */
export const useCheckNameDuplication = (
  name: string,
  onSuccess: () => void,
  onError: (err: string) => void,
) =>
  useMutation({
    mutationFn: () => checkNameDuplication(name),
    onSuccess,
    onError,
  });
