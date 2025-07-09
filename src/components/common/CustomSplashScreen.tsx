import React, {useEffect, useRef} from 'react';
import {StyleSheet, Dimensions, Animated} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

// SVG 이미지들을 import
import SplashLight from '@assets/splash/splash_light.svg';
import SplashDark from '@assets/splash/splash_dark.svg';

const {width, height} = Dimensions.get('window');

interface CustomSplashScreenProps {
  visible: boolean;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  visible,
}) => {
  const {theme, themeMode} = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) {
      // 페이드 아웃 애니메이션
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) {
    return null;
  }

  // 테마에 따라 다른 스플래시 이미지 선택
  const SplashImage = themeMode === 'dark' ? SplashDark : SplashLight;

  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: theme.background, opacity: fadeAnim},
      ]}>
      <SplashImage width={width * 0.8} height={height * 0.4} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
