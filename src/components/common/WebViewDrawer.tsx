import React from 'react';
import {View, StyleSheet, Dimensions, Modal} from 'react-native';
import WebView from 'react-native-webview';
import DrawerAnimator from './DrawerAnimator';

const {height} = Dimensions.get('window');
export const DRAWER_HEIGHT = height * 0.9;

interface WebViewDrawerProps {
  isVisible: boolean;
  url: null | string;
  onClose: Function;
}

const WebViewDrawer = ({isVisible, url, onClose}: WebViewDrawerProps) => {
  return (
    <Modal visible={isVisible} transparent>
      <DrawerAnimator isVisible={isVisible} onClose={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.handle} />
          </View>
          {url && (
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
          )}
        </View>
      </DrawerAnimator>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: DRAWER_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'absolute', // 절대 위치로 고정
    bottom: 0, // 화면 하단에 고정
    left: 0,
    right: 0,
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
