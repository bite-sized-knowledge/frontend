// StartButton
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {typography} from '../../styles/tokens/typography';

interface StartButtonProps {
  onPress: () => void;
  disabled: boolean;
}

export const StartButton: React.FC<StartButtonProps> = ({
  onPress,
  disabled,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}>
        <Text style={[typography.subHead, !disabled && styles.text]}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14, // 원하는 padding 값 설정
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6E1C',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  text: {
    color: '#FFFFFF', // 텍스트를 흰색으로 설정
  },
});
