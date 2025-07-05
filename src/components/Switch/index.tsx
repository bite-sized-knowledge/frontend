import React, {useEffect, useRef} from 'react';
import {
  View,
  Pressable,
  Animated,
  StyleSheet,
  ViewStyle,
  StyleProp,
  PressableProps,
} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

interface SwitchProps extends Omit<PressableProps, 'onPress'> {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  trackColor?: {
    false: string;
    true: string;
  };
  thumbColor?: string;
  size?: 'small' | 'medium' | 'large';
  activeThumbIcon?: React.ReactNode;
  inactiveThumbIcon?: React.ReactNode;
  thumbIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SWITCH_SIZES = {
  small: {
    width: 40,
    height: 24,
    thumbSize: 18,
    padding: 3,
  },
  medium: {
    width: 48,
    height: 28,
    thumbSize: 22,
    padding: 3,
  },
  large: {
    width: 56,
    height: 32,
    thumbSize: 26,
    padding: 3,
  },
};

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  trackColor,
  thumbColor,
  size = 'medium',
  activeThumbIcon,
  inactiveThumbIcon,
  thumbIcon,
  style,
  ...props
}) => {
  const {theme} = useTheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const sizeConfig = SWITCH_SIZES[size];

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      sizeConfig.padding,
      sizeConfig.width - sizeConfig.thumbSize - sizeConfig.padding,
    ],
  });

  const trackBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      trackColor?.false || theme.gray4,
      trackColor?.true || theme.main,
    ],
  });

  const thumbBackgroundColor = thumbColor || theme.background;

  // 현재 상태에 따라 아이콘 선택
  const getCurrentIcon = () => {
    if (thumbIcon) {
      return thumbIcon;
    }
    if (value && activeThumbIcon) {
      return activeThumbIcon;
    }
    if (!value && inactiveThumbIcon) {
      return inactiveThumbIcon;
    }
    return null;
  };

  const currentIcon = getCurrentIcon();

  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}>
      <Animated.View
        style={[
          styles.track,
          {
            width: sizeConfig.width,
            height: sizeConfig.height,
            backgroundColor: trackBackgroundColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: sizeConfig.thumbSize,
              height: sizeConfig.thumbSize,
              backgroundColor: thumbBackgroundColor,
              transform: [{translateX}],
            },
          ]}>
          {currentIcon && (
            <View style={styles.iconContainer}>{currentIcon}</View>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    borderRadius: 100,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  thumb: {
    borderRadius: 100,
    position: 'absolute',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default Switch;
