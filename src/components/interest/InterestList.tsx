import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { InterestItem } from './InterestItem';
import { Interest } from '@/types/Interest';
import { getInterests } from '@/api/InterestApi';

interface InterestListProps {
  selectedItems: number[]; 
  onItemSelect: (item: Interest) => void; 
}

export const InterestList: React.FC<InterestListProps> = ({ selectedItems, onItemSelect }) => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInterests();
        setInterests(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  if (error) {
    return <View><Text style={{ color: 'red' }}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      {interests.map((item) => (
        <View key={item.id} style={styles.itemWrapper}>
          <InterestItem
            item={item} // InterestItem이 name을 필요로 한다고 가정
            isSelected={selectedItems.includes(item.id)} // id 기반으로 선택 상태 확인
            onPress={() => onItemSelect(item)} // 전체 객체 전달
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
    justifyContent: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  itemWrapper: {
    width: '31%',
    aspectRatio: 1,
    alignItems: 'center',
  },
});
