import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { InterestHeader } from '../../components/interest/InterestHeader';
import { InterestList } from '../../components/interest/InterestList';
import { StartButton } from '../../components/interest/StartButton';
import { usePostInterest } from '@/hooks/useInterestMutations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Interest } from '@/types/Interest';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const InterestSelection = () => {
  const [selectedItems, setSelectedItems] = useState<Interest[]>([]);
  const { mutate, isPending } = usePostInterest(); // React Query 훅 사용

  const handleItemSelect = (item: Interest) => {
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id) // 이미 선택된 경우 제거
        : [...prev, item] // 선택되지 않은 경우 추가
    );
  };

  const handleStart = async () => {
    if (selectedItems.length === 0) return;

    // 선택한 관심사의 id 리스트 추출
    const interestIds = selectedItems.map(item => item.id);

    mutate(
      { interestIds },
      {
        onSuccess: async data => {
          const accessToken = data.result.tokenResponse.accessToken;
          const refreshToken = data.result.tokenResponse.refreshToken;

          try {
            // AsyncStorage에 저장
            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);

            // 저장 완료 후 성공 메시지 띄우기
            Alert.alert('가입 완료!', `회원 ID: ${data.result.memberId}\nAccessToken이 저장되었습니다.`);
            console.log('Access Token:', accessToken);
            console.log('Refresh Token:', refreshToken);
          } catch (error) {
            Alert.alert('저장 실패', '토큰 저장 중 오류가 발생했습니다.');
            console.error('AsyncStorage 저장 오류:', error);
          }
        },
        onError: error => {
          Alert.alert('오류 발생', error.message);
          console.log('error', error);
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <InterestHeader />
        <InterestList
          selectedItems={selectedItems.map(item => item.id)} // 선택된 id 배열 전달
          onItemSelect={handleItemSelect}
        />
        <StartButton
          onPress={handleStart}
          disabled={isPending || selectedItems.length === 0}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
