import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface InterestItemProps {
  item: string;
  isSelected: boolean;
  onPress: () => void;
}

export const InterestItem: React.FC<InterestItemProps> = ({
  item,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.selectedItem]}
      onPress={onPress}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 100, // 고정 너비
    height: 100, // 고정 높이
    backgroundColor: '#ECECEC',
    margin: 10,
    borderRadius: 10,
    padding: 10, // 텍스트를 내부에서 여백
  },
  selectedItem: {
    backgroundColor: '#000000',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    flexWrap: 'wrap', // 텍스트 줄바꿈 허용
    textAlign: 'left', // 왼쪽 정렬
  },
});
