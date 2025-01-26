import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { InterestItem } from './InterestItem';

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

export const InterestList: React.FC<InterestListProps> = ({ selectedItems, onItemSelect }) => {
  return (
    <FlatList
      data={INTERESTS}
      keyExtractor={(item, index) => `${item}-${index}`}
      renderItem={({ item, index }) => (
        <View
          style={[
            styles.itemWrapper,
            index === INTERESTS.length - 1 && styles.lastItemWrapper,
          ]}
        >
          <InterestItem
            item={item}
            isSelected={selectedItems.includes(item)}
            onPress={() => onItemSelect(item)}
          />
        </View>
      )}
      numColumns={3}
      contentContainerStyle={styles.grid}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    margin: 10,
  },
  itemWrapper: {
    flex: 1, // 각 항목이 동일한 크기를 갖도록 함
    alignItems: 'center', // 기본적으로 중앙 정렬
  },
  lastItemWrapper: {
    alignItems: 'flex-start', // 마지막 항목만 왼쪽 정렬
  },
});
