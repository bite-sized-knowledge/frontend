import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  NativeSyntheticEvent,
} from 'react-native';
import {Portal} from 'react-native-portalize';
import {WebView} from 'react-native-webview';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import {BASE_URL} from '@env';
import {
  WebViewError,
  WebViewHttpError,
} from 'react-native-webview/lib/WebViewTypes';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// Drawer 높이: 전체 화면의 80%
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.9;
const ANIMATION_DURATION = 300; // 애니메이션 지속시간 (ms)

interface WebViewDrawerProps {
  visible: boolean;
  onClose: () => void;
  uri?: string | null;
}

type ContextType = {
  startY: number;
};

export const WebViewDrawer: React.FC<WebViewDrawerProps> = ({
  visible,
  onClose,
  uri,
}) => {
  const {theme} = useTheme();
  // 부모의 visible prop과 별도로 내부 렌더링 상태 관리: 닫힘 애니메이션 완료 전까지 렌더링 유지
  const [shouldRender, setShouldRender] = useState(visible);
  // 웹뷰 에러 상태 (에러 발생 시 사용자에게 메시지 및 재시도 기능 제공)
  const [webviewError, setWebviewError] = useState<string | null>(null);

  // overlayOpacity shared value와 animated style 추가
  const overlayOpacity = useSharedValue(0);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  // Drawer의 Y축 이동 값: 0은 완전 열림, DRAWER_HEIGHT는 완전 닫힘 상태
  const translateY = useSharedValue(DRAWER_HEIGHT);

  // closeDrawer 함수: 오버레이 클릭 시 닫힘 애니메이션 실행 후 onClose 호출 (그냥 onClose 호출하면 Drawer 내려가는 동안 컨텐츠가 안보임)
  const closeDrawer = useCallback(() => {
    overlayOpacity.value = withTiming(0, {duration: ANIMATION_DURATION});
    translateY.value = withTiming(
      DRAWER_HEIGHT,
      {duration: ANIMATION_DURATION},
      isFinished => {
        if (isFinished) {
          runOnJS(onClose)();
        }
      },
    );
  }, [overlayOpacity, translateY, onClose]);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // 열릴 때 Drawer와 Overlay 모두 애니메이션 실행
      overlayOpacity.value = withTiming(1, {duration: ANIMATION_DURATION});
      translateY.value = withTiming(0, {duration: ANIMATION_DURATION});
    } else {
      // 닫힐 때 Overlay를 먼저 사라지게 하고, Drawer 애니메이션 후 언마운트
      overlayOpacity.value = withTiming(0, {duration: ANIMATION_DURATION});
      translateY.value = withTiming(
        DRAWER_HEIGHT,
        {duration: ANIMATION_DURATION},
        isFinished => {
          if (isFinished) {
            runOnJS(setShouldRender)(false);
          }
        },
      );
    }
  }, [visible, translateY, overlayOpacity]);

  // 애니메이션 스타일: translateY 값에 따라 Drawer 위치 조정
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  // 웹뷰 에러 처리: 에러 발생 시 에러 메시지 설정 (메모리 누수를 방지하기 위해 useCallback 사용)
  const handleWebViewError = useCallback(
    (syntheticEvent: NativeSyntheticEvent<WebViewError | WebViewHttpError>) => {
      const {nativeEvent} = syntheticEvent;
      console.warn('WebView error: ', nativeEvent);
      setWebviewError('웹페이지를 불러오지 못했습니다.');
    },
    [],
  );

  // TODO: useAnimatedGestureHandler 버전업
  // 손잡이 영역에서만 드래그 가능하도록 제스처 핸들러 구현
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      // 위쪽(음수) 이동 방지: 항상 0 이상의 값 유지
      translateY.value = Math.max(context.startY + event.translationY, 0);
    },
    onEnd: () => {
      // 드래그로 이동한 거리가 Drawer 높이의 30% 이상이면 닫힘 처리
      if (translateY.value > DRAWER_HEIGHT * 0.3) {
        translateY.value = withTiming(
          DRAWER_HEIGHT,
          {duration: ANIMATION_DURATION},
          isFinished => {
            if (isFinished) {
              runOnJS(onClose)();
            }
          },
        );
      } else {
        // 그렇지 않으면 원래 열린 상태로 복귀
        translateY.value = withTiming(0, {duration: ANIMATION_DURATION});
      }
    },
  });

  // 내부 렌더링 상태가 false면 실제로 렌더링하지 않음 (애니메이션 완료 후)
  // if (!shouldRender) return null;

  return (
    <Portal>
      <View style={StyleSheet.absoluteFill}>
        {/* Overlay: 터치 시 Drawer 닫힘 (TouchableWithoutFeedback으로 터치 효과 제거) */}
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <Animated.View style={[styles.overlay, overlayAnimatedStyle]} />
        </TouchableWithoutFeedback>

        {/* Drawer 컨테이너 */}

        <Animated.View
          style={[
            styles.drawerContainer,
            animatedStyle,
            {backgroundColor: theme.background},
          ]}>
          {/* 손잡이 영역 (여기서만 드래그 가능) */}
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={styles.handle}>
              <View
                style={[styles.handleIndicator, {backgroundColor: theme.gray1}]}
              />
            </Animated.View>
          </PanGestureHandler>
          {/* WebView 또는 에러 메시지 영역 */}
          {uri && !webviewError ? (
            <WebView
              key={uri}
              // 웹뷰 에러 발생용 uri
              // source={{uri: uri ? 'https://thisurldoesnotexist.example.com' : ''}}
              source={{uri: `${BASE_URL}/v1/links/${uri}`}}
              style={styles.webview}
              startInLoadingState
              onError={handleWebViewError}
              onHttpError={handleWebViewError}
            />
          ) : (
            webviewError && (
              <View style={styles.errorContainer}>
                <Text
                  style={[
                    styles.errorText,
                    typography.body,
                    {color: theme.text},
                  ]}>
                  {webviewError || 'URL이 제공되지 않았습니다.'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // 재시도: 에러 상태 초기화하여 WebView를 재마운트함
                    setWebviewError(null);
                  }}
                  style={[styles.retryButton, {backgroundColor: theme.main}]}>
                  <Text style={[typography.body, {color: theme.background}]}>
                    재시도
                  </Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </Animated.View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    bottom: 0,
    height: DRAWER_HEIGHT,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  handle: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
