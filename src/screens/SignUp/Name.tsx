import CustomHeader from '@/components/common/CustomHeader.tsx';
import {useTheme} from '@/context/ThemeContext.tsx';
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ProgressBar} from './ProgressBar.tsx';
import {typography} from '@/styles/tokens/typography.ts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BaseInput} from '@/components/input/index.tsx';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  NativeFunnelParamList,
  navigationParamName,
  비밀번호입력,
} from './signUpContext.ts';
import {BaseButton} from '@/components/button/index.tsx';

interface NameProps {
  onNext: Function;
  onBack: (context: 비밀번호입력) => void;
}

export const Name = ({onNext, onBack}: NameProps) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  const route = useRoute<RouteProp<NativeFunnelParamList>>();
  const useFunnelState = route.params?.[navigationParamName]?.signUp?.context;

  const [name, setName] = useState<string>(useFunnelState?.name ?? '');

  const handleBackPress = () => {
    onBack({email: useFunnelState.email, name: ''});
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <CustomHeader
        title={'정보입력'}
        showBackButton={true}
        onBackPress={handleBackPress}
      />
      <ProgressBar progress={0.6} />
      <View style={[styles.wrapper, {paddingBottom: insets.bottom + 20}]}>
        <Text style={[typography.subHead, {color: theme.main}]}>
          잘하고 있어요!
        </Text>
        <View style={styles.content}>
          <Text style={[typography.title, {color: theme.text}]}>
            이름을 입력해주세요.
          </Text>
          <BaseInput
            placeholder="이름을 입력해주세요."
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            msg={
              '2~16글자를 입력해주세요.\n사람들에게 보여지는 이름으로, 불쾌함을 줄 수 있는 이름은 경고없이 변경돼요.'
            }
            error={'이미 사용중인 이름이에요.'}
          />
        </View>
        {name.length > 0 && (
          <BaseButton
            title={'확인'}
            style={[
              styles.loginButton,
              {
                backgroundColor: theme.main,
              },
            ]}
            textStyle={{color: 'white'}}
            onPress={() => onNext(name)}
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
