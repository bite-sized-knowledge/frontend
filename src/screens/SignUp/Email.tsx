import CustomHeader from '@/components/common/CustomHeader.tsx';
import {useTheme} from '@/context/ThemeContext.tsx';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ProgressBar} from './ProgressBar.tsx';
import {typography} from '@/styles/tokens/typography.ts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BaseInput} from '@/components/input/index.tsx';
import {RouteProp, useRoute} from '@react-navigation/native';
import {NativeFunnelParamList, navigationParamName} from './signUpContext.ts';
import {BaseButton} from '@/components/button/index.tsx';

interface EmailProps {
  onNext: Function;
}

export const Email = ({onNext}: EmailProps) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<NativeFunnelParamList>>();
  const useFunnelState = route.params?.[navigationParamName]?.signUp?.context;
  const [email, setEmail] = useState<string>(useFunnelState?.email ?? '');

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
          />
        </View>
        {email.trim().length > 0 && (
          <BaseButton
            title={'인증번호 전송'}
            style={[
              styles.loginButton,
              {
                backgroundColor: theme.main,
              },
            ]}
            textStyle={{color: 'white'}}
            onPress={() => onNext(email)}
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
