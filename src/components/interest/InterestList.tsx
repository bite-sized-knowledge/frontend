import React from 'react';
import {View, StyleSheet} from 'react-native';
import {InterestItem} from './InterestItem';

interface InterestListProps {
  selectedItems: string[];
  onItemSelect: (item: string) => void;
}

const INTERESTS = [
  'Web',
  'Mobile',
  'Hardware & IoT',
  'Ai & MI & Data',
  'Security & Network',
  'DB',
  'DevOps & Infra',
  'Game',
  '기획',
  'Design',
];

export const InterestList: React.FC<InterestListProps> = ({
  selectedItems,
  onItemSelect,
}) => {
  return (
    <View style={styles.container}>
      {INTERESTS.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.itemWrapper}>
          <InterestItem
            item={item}
            isSelected={selectedItems.includes(item)}
            onPress={() => onItemSelect(item)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between', // 각 줄에서 아이템 간격 균등 분배
    paddingHorizontal: 14, // 좌우 공백 추가
    paddingVertical: 14, // 상하 공백 추가
  },
  itemWrapper: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
  },
});
