import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {InterestHeader} from '../../components/interest/InterestHeader';
import {InterestList} from '../../components/interest/InterestList';
import {StartButton} from '../../components/interest/StartButton';
import {usePostInterest} from '../../data/InterestApi'; // 추가

export const InterestSelectionExample = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const {mutate, isPending} = usePostInterest(); // React Query 훅 사용

  const handleItemSelect = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const handleStart = () => {
    if (selectedItems.length === 0) return;

    // 선택한 관심사를 숫자로 변환
    const interestIds = selectedItems.map((_, index) => index + 1);

    mutate(
      {interestIds},
      {
        onSuccess: data => {
          Alert.alert('가입 완료!', `회원 ID: ${data.result.memberId}`);
          console.log('토큰:', data.result.tokenResponse.accessToken);
        },
        onError: error => {
          Alert.alert('오류 발생', error.message);
          console.log('error', error);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <InterestHeader />
      <InterestList
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
      />
      <StartButton
        onPress={handleStart}
        disabled={isPending || selectedItems.length === 0}
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
