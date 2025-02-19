import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { InterestHeader } from '../../components/interest/InterestHeader';
import { InterestList } from '../../components/interest/InterestList';
import { StartButton } from '../../components/interest/StartButton';
import { usePostInterest } from '@/hooks/useInterestMutations';
import { getInterest } from '@api/InterestApi';

export const InterestSelection = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [interestList, setInterestList] = useState<{ id: number; name: string }[]>([]);

  // usePostInterest 훅에 onSuccess, onError 로직을 전달
  const { mutate } = usePostInterest(
    (data) => {
      Alert.alert('가입 완료!', `회원 ID: ${data.result.memberId}`);
      console.log('토큰:', data.result.tokenResponse.accessToken);
    },
    (error) => {
      Alert.alert('오류 발생', error.message);
      console.log('error', error);
    }
  );

  // 관심사 목록을 불러오기 위한 useEffect
  useEffect(() => {
    const fetchInterests = async () => {
      const response = await getInterest();
      console.log(response)
      setInterestList(response.data?.result || []);  // 기본값 처리
    };
    fetchInterests();
  }, []);

  const handleItemSelect = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const handleStart = () => {
    if (selectedItems.length === 0) return;

    // 선택한 관심사를 숫자로 변환 (선택한 이름을 기반으로 실제 id를 찾아서 사용)
    const interestIds = interestList
      .filter(interest => selectedItems.includes(interest.name))
      .map(interest => interest.id);

    mutate({ interestIds });
  };

  return (
    <View style={styles.container}>
      <InterestHeader />
      <InterestList selectedItems={selectedItems} onItemSelect={handleItemSelect} />
      <StartButton
        onPress={handleStart}
        disabled={selectedItems.length === 0} // isPending 삭제
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});