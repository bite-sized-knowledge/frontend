import {useTheme} from '@/context/ThemeContext.tsx';
import React from 'react';
import {View, StyleSheet} from 'react-native';

interface ProgressProps {
  progress: number; // 0 ~ 1 사이의 값 (예: 0.5는 50% 완료)
}

export const ProgressBar = ({progress}: ProgressProps) => {
  const {theme} = useTheme();
  const progressPercent = Math.round(progress * 100);

  return (
    <View style={[styles.progressBar, {backgroundColor: theme.gray4}]}>
      <View
        style={[
          styles.progressFill,
          {width: `${progressPercent}%`},
          {backgroundColor: theme.text},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
