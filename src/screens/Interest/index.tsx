import {getGuestAccount, getInterests} from '@/api/interestApi';
import {BaseButton} from '@/components/button';
import CustomHeader from '@/components/common/CustomHeader';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Loading} from '../Loading';
import {RootStackParamList, ROOT_SCREENS} from '@/types/constants/rootScreens';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface InterestProps {
  onNext?: Function;
}

export const Interest = ({onNext}: InterestProps) => {
  const {theme} = useTheme();
  const [selectedItem, setSelectedItem] = useState<number[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // 관심 주제 선택 후 피드 화면 나오기 전 로딩 화면 플래그
  const [loading, setLoading] = useState(false);

  const {data: interests, isLoading} = useQuery({
    queryKey: ['interests'], // 캐시 키를 배열 형태로 지정
    queryFn: getInterests, // 데이터를 가져오는 비동기 함수
  });

  const numColumns = 3;
  const numRows = Math.ceil((interests ?? []).length / numColumns);

  const selectItem = (index: number) => {
    const isExist = selectedItem.includes(index);
    setSelectedItem(prev =>
      isExist ? prev.filter(item => item !== index) : [...prev, index],
    );
  };

  const navigateLogin = () => {
    navigation.navigate(ROOT_SCREENS.AUTH);
  };

  const startWithGuest = async () => {
    if (selectedItem.length < 1) {
      return;
    }

    if (onNext) {
      onNext();
      return;
    }

    setLoading(true);
    try {
      // 서버로 데이터 전송 (예시 URL 사용)
      await getGuestAccount(selectedItem);
      await AsyncStorage.setItem('interestIds', JSON.stringify(selectedItem));

      // 2초 후에 로딩 종료 및 화면 전환
      setTimeout(() => {
        setLoading(false);
        navigation.navigate(ROOT_SCREENS.MAIN);
      }, 2000);
    } catch (error) {
      console.error('전송 실패:', error);
      setLoading(false);
    }
  };

  // 관심목록 조회동안 보여주는 뷰
  if (isLoading) {
    return <></>;
  }

  // 피드로 넘어가기전 뷰
  if (!onNext && loading) {
    return <Loading />;
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <CustomHeader title={''} style={{height: 20, paddingVertical: 0}} />
      <View style={styles.wrapper}>
        <Text style={[typography.title, {color: theme.text}]}>
          안녕하세요!{'\n'}
          관심있는 주제는 무엇인가요?
        </Text>
        <Text style={[typography.label, {paddingTop: 8}]}>
          *중복 선택 할 수 있어요.
        </Text>
      </View>

      {/* 행(row) 단위로 감싸기 */}
      <View style={[styles.contentWrapper, styles.row]}>
        {interests &&
          Array.from({length: numRows}).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.col}>
              {Array.from({length: numColumns}).map((_, colIndex) => {
                const itemIndex = rowIndex * numColumns + colIndex;
                if (itemIndex < interests.length) {
                  return (
                    <ItemBox
                      key={itemIndex}
                      interest={interests[itemIndex]}
                      onPress={() => selectItem(interests[itemIndex].id)}
                      isSelected={selectedItem.includes(
                        interests[itemIndex].id,
                      )}
                    />
                  );
                } else {
                  // 빈 아이템 처리 (아이템 개수가 numColumns의 배수가 아닐 경우)
                  return (
                    <View
                      key={colIndex}
                      style={[styles.itemBox, styles.emptyBox]}
                    />
                  );
                }
              })}
            </View>
          ))}
      </View>

      <View style={styles.wrapper}>
        <BaseButton
          title={'이미 계정이 있나요? 로그인'}
          textStyle={{
            color: theme.gray3,
            ...typography.label,
            textDecorationLine: 'underline',
          }}
          onPress={navigateLogin}
        />
        {selectedItem.length > 0 ? (
          <BaseButton
            title={'시작하기'}
            style={[{backgroundColor: theme.main}]}
            textStyle={{color: theme.background}}
            onPress={startWithGuest}
          />
        ) : (
          <BaseButton
            title={'시작하기'}
            style={[{backgroundColor: theme.gray4}]}
            textStyle={{color: theme.text}}
          />
        )}
      </View>
    </View>
  );
};

interface ItemBoxProps {
  interest: {id: number; name: string; image: string};
  onPress: () => void;
  isSelected: boolean;
}

const ItemBox = ({interest, onPress, isSelected}: ItemBoxProps) => {
  const {theme} = useTheme();

  console.log(interest);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.itemBox,
        {
          backgroundColor: theme.gray4,
        },
      ]}>
      <View>
        <Text style={[styles.text]}>{interest.name}</Text>
      </View>

      <Image src={interest.image} style={styles.icon} />

      {/* 선택 시 오버레이 (흐림 처리) */}
      {isSelected && <View style={styles.overlay} />}

      {isSelected && (
        <View style={styles.checkMark}>
          <Image
            style={[styles.selectedImage]}
            source={require('@/assets/image/check.png')}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  contentWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  // 각 행(row)은 가로로 아이템 3개를 배치합니다.
  col: {
    flexDirection: 'row',
    gap: 10,
  },
  row: {
    gap: 12,
  },
  itemBox: {
    flex: 1,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 10,
    aspectRatio: 1 / 1,
    position: 'relative', // 체크 표시 배치를 위해 필요
  },
  // 빈 박스 스타일 (아이템이 없는 경우)
  emptyBox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  selectedImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    margin: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 110, 28, 0.9)', // 어두운 반투명 효과
    borderRadius: 10,
  },
});

export default Interest;
