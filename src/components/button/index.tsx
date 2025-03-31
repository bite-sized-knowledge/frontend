import {typography} from '@/styles/tokens/typography';
import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface BaseButtonProps extends PressableProps {
  title: string;
  textStyle: TextStyle;
}

export const BaseButton = ({
  title,
  style,
  textStyle,
  ...props
}: BaseButtonProps) => {
  return (
    <Pressable
      style={({pressed}): StyleProp<ViewStyle> =>
        [
          styles.button,
          pressed && styles.pressed,
          style,
        ] as StyleProp<ViewStyle>
      }
      {...props}>
      <Text style={[typography.subHead, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 320,
    height: 56,
    borderRadius: 8,
  },
});
