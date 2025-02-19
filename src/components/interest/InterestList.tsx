// InterestListProps
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {InterestItem} from './InterestItem';
import {useQuery} from '@tanstack/react-query';
import { getInterest } from '@/api/InterestApi';


export interface InterestListProps {
  selectedItems: string[];
  onItemSelect: (item: string) => void;
}

export const InterestList: React.FC<InterestListProps> = ({
  selectedItems,
  onItemSelect,
}) => {
   // React Query로 데이터 가져오기
   const {data, isLoading, isError, error} = useQuery({
    queryKey: ['interest'],
    queryFn: getInterest,
  });

  return (
    <View style={styles.container}>
      {data?.data?.result.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.itemWrapper}>
          <InterestItem
            item={item.name}
            isSelected={selectedItems.includes(item.name)}
            onPress={() => onItemSelect(item.name)}
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
    flex: 1,
    gap: 12,
    justifyContent: 'flex-start', // 각 줄에서 아이템 간격 균등 분배
    paddingHorizontal: 14, // 좌우 공백 추가
    paddingVertical: 14, // 상하 공백 추가
  },
  itemWrapper: {
    width: '31%',
    aspectRatio: 1,
    alignItems: 'center',
  },
});
