import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import WebView from 'react-native-webview';

const {height} = Dimensions.get('window');
const DRAWER_HEIGHT = height * 0.8;

const WebViewDrawer = ({isVisible, url, onClose}) => {
  const slideAnim = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
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
        slideAnim.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAWER_HEIGHT * 0.2) {
          handleClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }).start();
        }
      },
    }),
  ).current;

  const handleClose = useCallback(() => {
    Animated.spring(slideAnim, {
      toValue: DRAWER_HEIGHT,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start(({finished}) => {
      if (finished) {
        setLocalVisible(false);
        onClose();
      }
    });
  }, [slideAnim, onClose]);

  useEffect(() => {
    if (isVisible) {
      setLocalVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    } else {
      setLocalVisible(false);
      handleClose();
    }
  }, [isVisible, slideAnim, handleClose]);

  if (!isVisible && !localVisible) return null;

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={handleClose}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{translateY: slideAnim}],
          },
        ]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={e => {
          e.stopPropagation();
        }}>
        <View {...panResponder.panHandlers} style={styles.header}>
          <View style={styles.handle} />
        </View>
        <WebView source={{uri: url}} style={styles.webview} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    position: 'absolute',
    top: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    padding: 10,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewDrawer;
