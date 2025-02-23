import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Portal} from 'react-native-portalize';
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

const DRAWER_HEIGHT = 390;
const ANIMATION_DURATION = 300;

type ContextType = {
  startY: number;
};

interface TermsAgreementDrawerProps {
  /** Drawer 노출 여부 */
  visible: boolean;
  /** Drawer 닫기 콜백 */
  onClose: () => void;
  /** 약관 동의 후 확인 시 호출되는 콜백 */
  onConfirm?: () => void;
}

/**
 * 약관 동의 바텀 드로어
 */
export const TermsAgreementDrawer: React.FC<TermsAgreementDrawerProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const {theme} = useTheme();
  // 내부 렌더링 상태: 닫히는 애니메이션 중엔 컴포넌트를 언마운트하지 않기 위함
  const [shouldRender, setShouldRender] = useState(visible);

  // 필수 / 선택 약관 동의 체크박스 상태
  const [isMandatoryChecked, setIsMandatoryChecked] = useState(false);
  const [isOptionalChecked, setIsOptionalChecked] = useState(false);

  // 오버레이/드로어 애니메이션을 위한 Reanimated shared values
  const overlayOpacity = useSharedValue(0);
  const translateY = useSharedValue(DRAWER_HEIGHT);

  // 드로어 닫기 함수
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

  // visible 값에 따라 열림/닫힘 애니메이션 처리
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // 드로어 위로 올리기
      overlayOpacity.value = withTiming(1, {duration: ANIMATION_DURATION});
      translateY.value = withTiming(0, {duration: ANIMATION_DURATION});
    } else {
      // 드로어 닫기
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
  }, [visible, overlayOpacity, translateY]);

  // 오버레이 투명도 스타일
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  // 드로어 위치 스타일
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  // 제스처 핸들러: 드로어 위쪽 '손잡이'를 드래그해서 내릴 수 있도록 처리
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      // 위로는 최대 0까지, 아래로는 최대 DRAWER_HEIGHT
      translateY.value = Math.max(context.startY + event.translationY, 0);
    },
    onEnd: () => {
      // 드래그가 30% 이상 내려가면 닫기
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
        translateY.value = withTiming(0, {duration: ANIMATION_DURATION});
      }
    },
  });

  // "확인" 버튼 눌렀을 때
  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    closeDrawer();
  }, [onConfirm, closeDrawer]);

  // 드로어 닫힘 애니메이션 완료 후엔 렌더링하지 않음
  if (!shouldRender) return null;

  return (
    <Portal>
      {/* 전체 영역 (오버레이 + 드로어) */}
      <View style={StyleSheet.absoluteFill}>
        {/* 오버레이 영역: 터치 시 드로어 닫기 */}
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <Animated.View style={[styles.overlay, overlayAnimatedStyle]} />
        </TouchableWithoutFeedback>

        {/* 드로어 */}
        <Animated.View
          style={[
            styles.drawerContainer,
            animatedStyle,
            {backgroundColor: theme.background},
          ]}>
          {/* 손잡이 (PanGestureHandler 영역) */}
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={styles.handle}>
              <View
                style={[styles.handleIndicator, {backgroundColor: theme.gray1}]}
              />
            </Animated.View>
          </PanGestureHandler>

          {/* 약관 체크박스 목록 */}
          <View style={styles.contentContainer}>
            {/* 필수 약관 */}
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={styles.checkboxTouch}
                activeOpacity={0.8}
                onPress={() => setIsMandatoryChecked(!isMandatoryChecked)}>
                <View
                  style={[
                    styles.checkbox,
                    isMandatoryChecked && {backgroundColor: theme.main},
                  ]}
                />
                <Text style={[typography.body, {color: theme.text}]}>
                  [필수] 개인정보 수집 및 이용 동의
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // TODO: 자세히보기 페이지/팝업 열기
                }}>
                <Text style={[typography.body, {color: theme.main}]}>
                  자세히보기
                </Text>
              </TouchableOpacity>
            </View>

            {/* 선택 약관 */}
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={styles.checkboxTouch}
                activeOpacity={0.8}
                onPress={() => setIsOptionalChecked(!isOptionalChecked)}>
                <View
                  style={[
                    styles.checkbox,
                    isOptionalChecked && {backgroundColor: theme.main},
                  ]}
                />
                <Text style={[typography.body, {color: theme.text}]}>
                  [선택] 알림을 이용할까요? (광고) 이런 항목
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // TODO: 자세히보기 페이지/팝업 열기
                }}>
                <Text style={[typography.body, {color: theme.main}]}>
                  자세히보기
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 확인 버튼 (필수 약관 체크 시에만 활성화) */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              {
                backgroundColor: isMandatoryChecked ? theme.main : theme.gray2,
              },
            ]}
            disabled={!isMandatoryChecked}
            onPress={handleConfirm}>
            <Text style={[typography.body, {color: theme.background}]}>
              확인
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  // 반투명 오버레이
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // 드로어 컨테이너
  drawerContainer: {
    position: 'absolute',
    bottom: 0,
    height: DRAWER_HEIGHT,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  // 손잡이 영역
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
  // 드로어 안쪽 컨텐츠
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  // 체크박스 행
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  checkboxTouch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#999',
  },
  // 확인 버튼
  confirmButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
