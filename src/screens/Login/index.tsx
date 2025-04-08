import React from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import {useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import Sso from '@/assets/sso';
import {BaseInput} from '@/components/input';
import {BaseButton} from '@/components/button';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {login} from '@/api/authApi';
import {ROOT_SCREENS, RootStackParamList} from '@/types/constants/rootScreens';
import {useAuth} from '@/hooks/useAuth';
import {AUTH_SCREENS, AuthStackParamList} from '@/types/constants/authScreens';

interface LoginProps {
  onBackPress?: () => void;
}

export const Login = ({onBackPress}: LoginProps) => {
  const {theme, themeMode} = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation =
    useNavigation<NavigationProp<RootStackParamList & AuthStackParamList>>();
  const {setLoggedIn} = useAuth();

  const handleLoginButtonClick = async () => {
    if (email.trim().length <= 1 || password.trim().length <= 1) return;

    const isSuccess = await login(email, password);

    if (!isSuccess) {
      Alert.alert('이메일 또는 비밀번호가 틀립니다.');
      return;
    }

    setLoggedIn(true);
    navigation.navigate(ROOT_SCREENS.MAIN);
  };

  console.log(navigation.getState());

  return (
    <View style={[styles.loginWrapper, {backgroundColor: theme.background}]}>
      <CustomHeader
        title={'로그인'}
        showBackButton={navigation.canGoBack()}
        onBackPress={onBackPress}
      />
      <View style={styles.loginContainer}>
        <View style={styles.loginTitle}>
          <Text style={[typography.title, {color: theme.text}]}>
            로그인하고
            {'\n'}더 유용한 지식을 얻어보세요!
          </Text>
        </View>
        <View style={styles.loginForm}>
          <BaseInput
            placeholder="이메일을 입력해주세요."
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <BaseInput
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <BaseButton
            title={'로그인'}
            onPress={handleLoginButtonClick}
            style={[
              styles.loginButton,
              {
                backgroundColor:
                  email.trim().length + password.trim().length > 0
                    ? theme.main
                    : theme.gray4,
              },
            ]}
            textStyle={{
              color:
                email.trim().length + password.trim().length > 0
                  ? themeMode === 'light'
                    ? theme.background
                    : theme.text
                  : theme.gray1,
            }}
          />
          <View style={styles.signUpAndforgotPw}>
            <Pressable
              onPress={() => navigation.navigate(AUTH_SCREENS.SIGN_UP)}>
              <Text style={[typography.label, {color: theme.gray3}]}>
                회원가입
              </Text>
            </Pressable>
            <Text style={[typography.label, {color: theme.gray3}]}>|</Text>
            <Pressable>
              <Text style={[typography.label, {color: theme.gray3}]}>
                비밀번호를 잊어버렸어요
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.ssoSection}>
          <Text style={(typography.label, {color: theme.gray3})}>
            SNS 간편 로그인
          </Text>
          <View style={styles.ssoImageWrapper}>
            <Pressable
              style={[
                styles.ssoImage,
                {borderColor: theme.gray3, backgroundColor: 'white'},
              ]}>
              <Sso.Google width={33.6} height={33.6} />
            </Pressable>
            <Pressable style={[styles.ssoImage, {backgroundColor: 'black'}]}>
              <Sso.Apple width={33.6} height={33.6} />
            </Pressable>
            <Pressable
              style={[
                styles.ssoImage,
                {borderColor: theme.gray3, backgroundColor: 'white'},
              ]}>
              <Sso.Github width={25} height={25} />
            </Pressable>
          </View>
          <Pressable onPress={() => navigation.navigate(ROOT_SCREENS.INTEREST)}>
            <Text
              style={[
                typography.label,
                {color: theme.gray3},
                styles.underLine,
              ]}>
              비회원으로 둘러보기
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginWrapper: {
    flex: 1,
  },
  loginContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  loginTitle: {
    paddingVertical: 16,
  },
  loginForm: {
    flexDirection: 'column',
    gap: 16,
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
  signUpAndforgotPw: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ssoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    paddingVertical: 24,
    flexDirection: 'column',
    gap: 16,
  },
  ssoImageWrapper: {
    flexDirection: 'row',
    gap: 24,
  },
  ssoImage: {
    width: 56,
    height: 56,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderRadius: 60,
    overflow: 'hidden',
  },
  underLine: {
    textDecorationLine: 'underline',
  },
});
