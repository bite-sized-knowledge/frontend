import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { typography } from '../../styles/tokens/typography';
import { Interest } from '@/types/Interest';

interface InterestItemProps {
  item: Interest;
  isSelected: boolean;
  onPress: () => void;
}

const replaceSlashWithAmpersand = (text: string) => text.replace(/\//g, '&');

export const InterestItem: React.FC<InterestItemProps> = ({ item, isSelected, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.item, isSelected && styles.selectedItem]}>
        <Text style={typography.body}>{replaceSlashWithAmpersand(item.name)}</Text>
        {isSelected && (
          <Image
            source={require('../../../assets/icons/check_white.png')}
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
    minWidth: 100, // 고정 너비
    minHeight: 100, // 고정 높이,
    aspectRatio: 1 / 1,
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10, // 텍스트를 내부에서 여백


  },
  selectedItem: {
    backgroundColor: '#FF6E1C',
  },
  checkImage: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: '50%', // 부모의 50% 높이에 위치
    left: '50%', // 부모의 50% 너비에 위치

  },
});
