import React from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';
import {useEffect, useRef} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {lightTheme, darkTheme} from '../../styles/theme';

const {width, height} = Dimensions.get('window');

const ShortSkeleton = () => {
  const {isDark} = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBackground,
            shadowColor: theme.shadowColor,
          },
        ]}>
        <Animated.View
          style={[
            styles.thumbnail,
            {backgroundColor: theme.skeletonBackground, opacity},
          ]}
        />
        <Animated.View style={[styles.titleBar, {opacity}]} />
        <Animated.View style={[styles.descriptionBar, {opacity}]} />
        <Animated.View
          style={[styles.descriptionBar, {opacity, width: '60%'}]}
        />
        <Animated.View style={[styles.authorBar, {opacity}]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnail: {
    width: '90%',
    height: '40%',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 15,
  },
  titleBar: {
    width: '80%',
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 10,
  },
  descriptionBar: {
    width: '90%',
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  authorBar: {
    width: '40%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 10,
  },
});

export default ShortSkeleton;
