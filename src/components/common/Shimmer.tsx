// Shimmer.tsx
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, StyleProp, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ShimmerProps {
  style?: StyleProp<ViewStyle>; // 수정: ViewStyle -> StyleProp<ViewStyle>
  children?: React.ReactNode;
}

export const Shimmer: React.FC<ShimmerProps> = ({style, children}) => {
  const shimmerAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimated, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmerAnimated]);

  const translateX = shimmerAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[styles.shimmerContainer, style]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, {transform: [{translateX}]}]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          style={styles.gradient}
        />
      </Animated.View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerContainer: {
    overflow: 'hidden',
    backgroundColor: '#d9d9d9',
  },
  gradient: {
    width: 200,
    height: '100%',
  },
});
