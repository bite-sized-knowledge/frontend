import React, {useRef, useCallback, useState} from 'react';
import {
  Animated,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  StyleSheet,
} from 'react-native';

const {height} = Dimensions.get('window');
const DRAWER_HEIGHT = height * 0.8;
const CLOSE_THRESHOLD = DRAWER_HEIGHT * 0.3; // 30% 이상 드래그하면 닫힘

const DrawerAnimator = ({children, isVisible, onClose}) => {
  const slideAnim = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [localVisible, setLocalVisible] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          return;
        }
        // 위로는 드래그 제한
        slideAnim.setValue(gestureState.dy);
        const opacity = Math.max(0, 1 - gestureState.dy / DRAWER_HEIGHT);
        fadeAnim.setValue(opacity);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > CLOSE_THRESHOLD || gestureState.vy > 0.5) {
          // 닫기
          animateToPosition(DRAWER_HEIGHT, 0, () => {
            setLocalVisible(false);
            onClose && onClose();
          });
        } else {
          // 다시 열기
          animateToPosition(0, 1);
        }
      },
    }),
  ).current;

  const animateToPosition = useCallback(
    (toValue, fadeValue, onComplete) => {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }),
        Animated.timing(fadeAnim, {
          toValue: fadeValue,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({finished}) => {
        if (finished && onComplete) {
          onComplete();
        }
      });
    },
    [slideAnim, fadeAnim],
  );

  React.useEffect(() => {
    if (isVisible) {
      setLocalVisible(true);
      animateToPosition(0, 1);
    } else if (localVisible) {
      animateToPosition(DRAWER_HEIGHT, 0, () => {
        setLocalVisible(false);
        onClose && onClose();
      });
    }
  }, [isVisible, animateToPosition, onClose, localVisible]);

  if (!localVisible) return null;

  return (
    <Animated.View style={[styles.fullScreen, {opacity: fadeAnim}]}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => {
          animateToPosition(DRAWER_HEIGHT, 0, () => {
            setLocalVisible(false);
            onClose && onClose();
          });
        }}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.drawer,
            {
              transform: [{translateY: slideAnim}],
            },
          ]}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT,
  },
});

export default DrawerAnimator;
