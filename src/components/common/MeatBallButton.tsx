import React, {useRef, useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useModal} from '../../hooks/useModal';
import {elevation} from '../../styles/tokens/elevation';
import {useTheme} from '../../context/ThemeContext';

// TODO(권대현): ... -> 아이콘 대체, 모달 완성
export const MeatBallButton = () => {
  const {isVisible, openModal, closeModal} = useModal();
  const {theme} = useTheme();

  const buttonRef = useRef(null);
  const [position, setPosition] = useState({x: 0, y: 0, width: 0, height: 0});

  const handleOpenModal = () => {
    console.log(position);
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({x: px, y: py, width, height});
        openModal();
      });
    }
  };

  return (
    <>
      <TouchableOpacity ref={buttonRef} onPress={handleOpenModal}>
        <Text>...</Text>
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
                },
              ]}>
              <View style={[styles.dropDownItem]}>
                <Image />
                <Text style={{color: theme.text}}>관심없음</Text>
              </View>
              <View style={[styles.dropDownItem]}>
                <Image />
                <Text style={{color: theme.text}}>신고하기</Text>
              </View>
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
    backgroundColor: 'white',
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
  },
});
