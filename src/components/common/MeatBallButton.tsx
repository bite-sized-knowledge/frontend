import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useModal} from '../../hooks/useModal';

// TODO(권대현): ... -> 아이콘 대체, 모달 완성
export const MeatBallButton = () => {
  const {isVisible, openModal, closeModal} = useModal();
  return (
    <>
      <TouchableOpacity onPress={openModal}>
        <Text>...</Text>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.dropDownItem}>
            <Text>관심 없음</Text>
            <Text>신고하기</Text>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropDownItem: {
    width: 137,
    height: 88,
    position: 'absolute',
    top: 100,
    zIndex: 10,
    borderRadius: 8,
  },
});
