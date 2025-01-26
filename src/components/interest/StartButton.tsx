import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface StartButtonProps {
  onPress: () => void;
  disabled: boolean;
}

export const StartButton: React.FC<StartButtonProps> = ({ onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>시작하기</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});
