import React, {useEffect, useRef} from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import {Animated, StyleSheet, Text, View} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {Keyframe} from 'react-native-reanimated';

export const Loading = () => {
  const barAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(barAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(barAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View>
      <CustomHeader title={''} />
      <View style={styles.wrapper}>
        <Text>
          관심있는 주제로{'\n'}
          글을 고르고 있어요!
        </Text>
      </View>

      <View style={styles.loader}>
        <View style={styles.loaderMiniContainer}>
          <View style={styles.barContainer}>
            <Animated.View style={[styles.bar, {opacity: barAnimation}]} />
            <Animated.View
              style={[styles.bar, styles.bar2, {opacity: barAnimation}]}
            />
          </View>
          <Svg width={101} height={114} viewBox="0 0 101 114" fill="none">
            <Circle
              cx={46.1726}
              cy={46.1727}
              r={29.5497}
              stroke="black"
              strokeWidth={7}
              transform="rotate(36 46.1726 46.1727)"
            />
            <Line
              x1={61.7089}
              y1={67.7837}
              x2={97.7088}
              y2={111.784}
              stroke="black"
              strokeWidth={7}
            />
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loaderMiniContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bar: {
    width: 10,
    height: 40,
    backgroundColor: 'black',
    marginHorizontal: 5,
  },
  bar2: {
    height: 30,
  },
});
