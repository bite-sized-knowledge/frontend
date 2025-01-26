import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { InterestHeader } from '../../components/interest/InterestHeader';
import { InterestList } from '../../components/interest/InterestList';
import { StartButton } from '../../components/interest/StartButton';

export const InterestSelectionExample = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemSelect = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleStart = () => {
    console.log('시작하기 버튼 클릭');
    console.log('선택된 항목:', selectedItems);
  };

  return (
    <View style={styles.container}>
      <InterestHeader />
      <InterestList selectedItems={selectedItems} onItemSelect={handleItemSelect} />
      <StartButton onPress={handleStart} disabled={selectedItems.length === 0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center', // 수직 정렬
  },
});
