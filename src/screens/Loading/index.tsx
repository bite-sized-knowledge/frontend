import React from 'react';

import {StyleSheet, Text, View} from 'react-native';
import LottieView from 'lottie-react-native';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const Loading = () => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {/* 텍스트: 좌측 상단 */}
      <View style={[styles.textWrapper, {top: insets.top + 36, left: 20}]}>
        <Text style={[typography.title, {color: theme.text}]}>
          관심있는 주제로{'\n'}
          글을 고르고 있어요!
        </Text>
      </View>

      {/* 로티: 화면 정중앙 */}
      <View style={styles.lottieWrapper}>
        <LottieView
          source={require('@assets/lottie/search.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textWrapper: {
    position: 'absolute',
  },
  lottieWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 46,
  },
  lottie: {
    width: 300,
    height: 300,
  },
});
