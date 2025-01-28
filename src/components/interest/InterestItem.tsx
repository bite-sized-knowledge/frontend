import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image, View} from 'react-native';
import {typography} from '../../styles/tokens/typography';

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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.item, isSelected && styles.selectedItem]}>
        <Text style={typography.body}>{item}</Text>
        {isSelected && (
          <Image
            source={require('../../../assets/icons/check_white.png')} // 체크 이미지 경로
            style={styles.checkImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: 100, // 고정 너비
    height: 100, // 고정 높이
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    padding: 10, // 텍스트를 내부에서 여백
  },
  selectedItem: {
    backgroundColor: '#000000CC',
  },
  checkImage: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: '50%', // 부모의 50% 높이에 위치
    left: '50%', // 부모의 50% 너비에 위치
  },
});
