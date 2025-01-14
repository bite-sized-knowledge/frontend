import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import DrawerAnimator from './DrawerAnimator';

const {height} = Dimensions.get('window');
const DRAWER_HEIGHT = height * 0.8;

const WebViewDrawer = ({isVisible, url, onClose}) => {
  return (
    <DrawerAnimator isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.handle} />
        </View>
        <WebView
          source={{uri: url}}
          style={styles.webview}
          startInLoadingState={true}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onHttpError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView HTTP error: ', nativeEvent);
          }}
        />
      </View>
    </DrawerAnimator>
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
  webview: {
    flex: 1,
  },
});

export default WebViewDrawer;
