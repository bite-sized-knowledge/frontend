import CustomHeader from '@/components/common/CustomHeader.tsx';
import {useTheme} from '@/context/ThemeContext.tsx';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ProgressBar} from './ProgressBar.tsx';
import {typography} from '@/styles/tokens/typography.ts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BaseInput} from '@/components/input/index.tsx';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  NativeFunnelParamList,
  navigationParamName,
  이메일입력,
} from './signUpContext.ts';
import {BaseButton} from '@/components/button/index.tsx';

interface PasswordProps {
  onNext: Function;
  onBack: (context: 이메일입력) => void;
}

export const Password = ({onNext, onBack}: PasswordProps) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState<string>('');
  const [secondPassword, setSecondPassword] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const route = useRoute<RouteProp<NativeFunnelParamList>>();
  const useFunnelState = route.params?.[navigationParamName]?.signUp?.context;

  const handleBackPress = () => {
    onBack({email: useFunnelState.email});
  };

  // 정규식 설명:
  // (?=.*[a-z]) : 소문자 최소 1개 포함
  // (?=.*[A-Z]) : 대문자 최소 1개 포함
  // (?=.*\d)    : 숫자 최소 1개 포함
  // (?=.*[\W_]) : 특수문자 최소 1개 포함 (여기서 '_' 도 포함)
  // .{8,16}     : 전체 길이가 8자 이상 16자 이하
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;

  const validatePassword = (newValue: string) => {
    setPassword(newValue);
    setIsValid(passwordRegex.test(newValue));
  };

  const getPasswordStatus = () => {
    // 입력 전: 안내 문구, 일반 색상
    if (password.length === 0 && secondPassword.length === 0) {
      return {
        msg: '대소문자, 영문, 숫자, 특수문자를 포함해 8~16자를 입력해주세요.',
        color: undefined, // undefined면 BaseInput에서 기본 색상 사용
      };
    }
    // 입력 후: 조건 불만족, 빨간색
    if (!passwordRegex.test(password)) {
      return {
        msg: '대소문자, 영문, 숫자, 특수문자를 포함해 8~16자를 입력해주세요.',
        color: theme.error, // Red_Bite
      };
    }
    // 조건 만족, 일치하지 않음
    if (secondPassword.length > 0 && password !== secondPassword) {
      return {
        msg: '비밀번호가 일치하지 않아요.',
        color: theme.error, // Red_Bite
      };
    }
    // 조건 만족, 일치
    if (
      passwordRegex.test(password) &&
      secondPassword.length > 0 &&
      password === secondPassword
    ) {
      return {
        msg: '사용 가능한 비밀번호입니다.',
        color: theme.green,
      };
    }
    // 그 외(입력 중 등): 안내 문구, 일반 색상
    return {
      msg: '대소문자, 영문, 숫자, 특수문자를 포함해 8~16자를 입력해주세요.',
      color: undefined,
    };
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <CustomHeader
        title={'회원가입'}
        showBackButton={true}
        onBackPress={handleBackPress}
      />
      <ProgressBar progress={0.4} />
      <View style={[styles.wrapper, {paddingBottom: insets.bottom + 20}]}>
        <Text style={[typography.subHead, {color: theme.main}]}>반가워요!</Text>
        <View style={styles.content}>
          <Text style={[typography.title, {color: theme.text}]}>
            사용하실 비밀번호를 입력해주세요.
          </Text>
          <BaseInput
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChangeText={validatePassword}
            autoCapitalize="none"
            secureTextEntry={true}
          />
          <BaseInput
            placeholder="비밀번호 확인"
            value={secondPassword}
            onChangeText={setSecondPassword}
            autoCapitalize="none"
            secureTextEntry={true}
            msg={getPasswordStatus().msg}
            msgColor={getPasswordStatus().color}
          />
        </View>
        {password.length > 0 && password === secondPassword && (
          <BaseButton
            title={'확인'}
            style={[
              styles.loginButton,
              {
                backgroundColor: theme.main,
              },
            ]}
            textStyle={{color: 'white'}}
            onPress={() => onNext(password)}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingTop: 16,
    paddingHorizontal: 20,

    flex: 1,
  },
  content: {
    paddingTop: 4,
    flexDirection: 'column',
    gap: 20,
    flexGrow: 1,
  },
  input: {
    minWidth: 320,
    height: 48,
    borderBottomWidth: 1,
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 320,
    height: 56,
    borderRadius: 8,
  },
});
