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
          <View style={styles.modalBackground}>
            <View style={styles.dropDownItem}>
              <Text>관심 없음</Text>
              <Text>신고하기</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 어두운 색을 추가하여 모달 강조
  },
  dropDownItem: {
    width: 137,
    height: 88,
    backgroundColor: 'white',
    color: 'white',
    zIndex: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
