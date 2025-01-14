import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

const ThemeToggle = () => {
  const {isDark, setIsDark} = useTheme();

  return (
    <TouchableOpacity style={styles.button} onPress={() => setIsDark(!isDark)}>
      <Text style={styles.text}>{isDark ? '🌞' : '🌙'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 20,
    zIndex: 1000,
  },
  text: {
    fontSize: 24,
  },
});

export default ThemeToggle;
