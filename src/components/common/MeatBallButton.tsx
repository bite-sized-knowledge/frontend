import React, {useRef, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useModal} from '@/hooks/useModal';
import {elevation} from '@/styles/tokens/elevation';
import {useTheme} from '@/context/ThemeContext';
import {useMutation} from '@tanstack/react-query';
import {unInterest} from '@/api/articleApi';
import Icons from '@/assets/icons';
import {useToast} from 'react-native-toast-notifications';

export const MeatBallButton = ({article}) => {
  const {isVisible, openModal, closeModal} = useModal();
  const {theme} = useTheme();
  const toast = useToast();

  const buttonRef = useRef(null);
  const [position, setPosition] = useState({x: 0, y: 0, width: 0, height: 0});

  const handleOpenModal = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({x: px, y: py, width, height});
        openModal();
      });
    }
  };

  const {mutate: uninterestMutation} = useMutation({
    mutationFn: () => unInterest(article.id),
    onSuccess: () => {
      closeModal();
      toast.show('앞으로 비슷한 게시물이 더 적게 추천돼요.');
    },
  });

  return (
    <>
      <TouchableOpacity ref={buttonRef} onPress={handleOpenModal}>
        <Icons.Dots />
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={[elevation.card, styles.modalBackground]}>
            <View
              style={[
                styles.dropDownBox,
                {
                  position: 'absolute',
                  top: position.y + position.height + 12, // 버튼 아래로 배치
                  left: position.x - 100, // 버튼 위치 기준
                  backgroundColor: theme.background,
                },
              ]}>
              <Pressable
                onPress={() => uninterestMutation()}
                android_ripple={{color: '#dddddd'}}
                style={({pressed}) => [
                  {
                    opacity: pressed ? '0.5' : '1',
                  },
                ]}>
                <View style={[styles.dropDownItem]}>
                  <Icons.Bad />
                  <Text style={{color: theme.text}}>관심없음</Text>
                </View>
              </Pressable>
              {/* <View style={[styles.dropDownItem]}>
                <Icons.Complain />
                <Text style={{color: theme.text}}>신고하기</Text>
              </View> */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropDownBox: {
    color: 'white',
    zIndex: 10,
    borderRadius: 8,
    flexDirection: 'column',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  dropDownItem: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 5,
    alignItems: 'center',
  },
});
