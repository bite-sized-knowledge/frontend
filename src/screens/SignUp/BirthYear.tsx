import CustomHeader from '@/components/common/CustomHeader.tsx';
import {useTheme} from '@/context/ThemeContext.tsx';
import React, {useState} from 'react';
import {Keyboard, Pressable, StyleSheet, Text, View} from 'react-native';
import {ProgressBar} from './ProgressBar.tsx';
import {typography} from '@/styles/tokens/typography.ts';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BaseInput} from '@/components/input/index.tsx';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  NativeFunnelParamList,
  navigationParamName,
  이름입력,
} from './signUpContext.ts';
import YearSpinner from '@/components/yearSpinner/index.tsx';
import {BaseButton} from '@/components/button/index.tsx';

interface BirthYearProps {
  onNext: Function;
  onBack: (context: 이름입력) => void;
}

export const BirthYear = ({onNext, onBack}: BirthYearProps) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const [year, setYear] = useState<number>();
  const [isYearSpinnerVisible, setIsYearSpinnerVisible] = useState(false);

  const route = useRoute<RouteProp<NativeFunnelParamList>>();
  const useFunnelState = route.params?.[navigationParamName]?.signUp?.context;

  const handleBackPress = () => {
    onBack({
      email: useFunnelState.email,
      password: '',
      name: useFunnelState.name,
    });
  };

  // 모달 열기
  const openYearSpinner = () => {
    setIsYearSpinnerVisible(true);
  };

  // 모달 닫기
  const closeYearSpinner = () => {
    setIsYearSpinnerVisible(false);
  };

  // 모달에서 연도 선택 시 호출
  const handleSelectYear = (selectedValue: number) => {
    setYear(selectedValue);
    closeYearSpinner();
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
          마지막이에요!
        </Text>
        <View style={styles.content}>
          <Text style={[typography.title, {color: theme.text}]}>
            태어난 연도를 선택해주세요.
          </Text>
          <Pressable onPress={() => openYearSpinner}>
            <BaseInput
              placeholder="YYYY"
              value={year?.toString()}
              autoCapitalize="none"
              // editable={false}
              onFocus={() => {
                Keyboard.dismiss();
                openYearSpinner();
              }}
            />
          </Pressable>
        </View>
        <BaseButton
          title={'확인'}
          style={{backgroundColor: theme.main}}
          textStyle={{color: 'white'}}
          onPress={() => onNext(year)}
        />
      </View>
      <YearSpinner
        initialYear={year || 2000}
        visible={isYearSpinnerVisible}
        onClose={closeYearSpinner}
        onSelect={handleSelectYear}
      />
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
