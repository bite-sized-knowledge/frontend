import CustomHeader from '@/components/common/CustomHeader.tsx';
import {useTheme} from '@/context/ThemeContext.tsx';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ProgressBar} from '../ProgressBar.tsx';
import {typography} from '@/styles/tokens/typography.ts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BaseInput} from '@/components/input/index.tsx';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeFunnelParamList, navigationParamName} from '../signUpContext.ts';
import {BaseButton} from '@/components/button/index.tsx';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuthenticateEmail, useVerifyEmail} from '@/hooks/useSignUp.ts';
import {useToast} from 'react-native-toast-notifications';

interface EmailProps {
  onNext: Function;
}

export const Email = ({onNext}: EmailProps) => {
  const EmailStack = createStackNavigator();

  return (
    <EmailStack.Navigator initialRouteName={'emailInput'}>
      <EmailStack.Screen
        name="emailInput"
        component={() => <EmailInput />}
        options={{headerShown: false}}
      />
      <EmailStack.Screen
        name="emailAuth"
        component={() => <EmailAuth onNext={onNext} />}
        options={{headerShown: false}}
      />
    </EmailStack.Navigator>
  );
};

export const EmailInput = () => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<NativeFunnelParamList>>();
  const useFunnelState = route.params?.[navigationParamName]?.signUp?.context;
  const [email, setEmail] = useState<string>(useFunnelState?.email ?? '');
  const [errMsg, setErrMsg] = useState<string>('');
  const navigation = useNavigation();

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  const getEmailStatus = () => {
    // 입력 전
    if (email.length === 0) {
      return {
        msg: '',
        color: undefined, // undefined면 BaseInput에서 기본 색상 사용
      };
    }
    // 입력 후: 조건 불만족, 빨간색
    if (!emailRegEx.test(email)) {
      return {
        msg: '이메일을 다시 확인해주세요.',
        color: theme.error, // Red_Bite
      };
    }

    // 그 외
    return {
      msg: '',
      color: undefined,
    };
  };

  const {mutate: sendEmailMutation} = useAuthenticateEmail(
    email,
    data => {
      if (!data.status) {
        setErrMsg(data.data.message);
        return;
      }

      navigation.navigate('emailAuth', {email});
    },
    err => {
      setErrMsg(err);
    },
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <CustomHeader title={'회원가입'} showBackButton={true} />
      <ProgressBar progress={0.2} />
      <View style={[styles.wrapper, {paddingBottom: insets.bottom + 20}]}>
        <Text style={[typography.subHead, {color: theme.main}]}>반가워요!</Text>
        <View style={styles.content}>
          <Text style={[typography.title, {color: theme.text}]}>
            사용하실 이메일을 입력해주세요.
          </Text>
          <BaseInput
            placeholder="이메일을 입력해주세요."
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            msg={getEmailStatus().msg}
            msgColor={getEmailStatus().color}
          />
        </View>
        {email.trim().length > 0 && !errMsg && (
          <BaseButton
            title={'인증번호 전송'}
            style={[
              styles.loginButton,
              {
                backgroundColor: theme.main,
              },
            ]}
            textStyle={{color: 'white'}}
            onPress={() => sendEmailMutation()}
          />
        )}
      </View>
    </View>
  );
};

export const EmailAuth = ({onNext}: EmailProps) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const [email, setEmail] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, []);

  const {mutate: verifyEmail} = useVerifyEmail(
    email,
    data => {
      if (data) {
        onNext(email);
      } else {
        toast.show('이메일 인증이 완료되지 않았습니다.');
      }
    },
    _ => {
      toast.show('이메일 인증이 완료되지 않았습니다.');
    },
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <CustomHeader title={'회원가입'} showBackButton={true} />
      <ProgressBar progress={0.2} />
      <View style={[styles.wrapper, {paddingBottom: insets.bottom + 20}]}>
        <Text style={[typography.subHead, {color: theme.main}]}>반가워요!</Text>
        <View style={styles.content}>
          <Text style={[typography.title, {color: theme.text}]}>
            이메일로 번호를 보냈어요!
            {'\n'}
            확인 후 인증을 완료해주세요.
          </Text>
        </View>

        <BaseButton
          title={'인증 완료'}
          style={[
            styles.loginButton,
            {
              backgroundColor: theme.main,
            },
          ]}
          textStyle={{color: 'white'}}
          onPress={() => verifyEmail()}
        />
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
