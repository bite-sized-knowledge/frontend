import {getGuestAccount, getInterests} from '@/api/interestApi';
import {BaseButton} from '@/components/button';
import CustomHeader from '@/components/common/CustomHeader';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
// ScrollView를 import 합니다.
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
    navigation.reset({
      index: 0,
      routes: [{name: ROOT_SCREENS.AUTH}],
    });
  };

  const startWithGuest = async () => {
    if (selectedItem.length < 1) {
      return;
    }

    try {
      // 서버로 데이터 전송 (예시 URL 사용)
      await getGuestAccount(selectedItem);
      await AsyncStorage.setItem('interestIds', JSON.stringify(selectedItem));

      if (onNext) {
        onNext();
        return;
      }

      setLoading(true);

      // 2초 후에 로딩 종료 및 화면 전환
      setTimeout(() => {
        navigation.navigate(ROOT_SCREENS.MAIN);
        setLoading(false);
      }, 1500);
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
    // styles.container에 flex: 1이 적용되어 있어 전체 화면을 차지합니다.
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {/* --- 상단 고정 컨텐츠 --- */}
      <CustomHeader title={''} style={{height: 20, paddingVertical: 0}} />
      <View style={styles.wrapper}>
        <Text style={[typography.title, {color: theme.text}]}>
          안녕하세요!{'\n'}
          관심있는 주제는 무엇인가요?
        </Text>
        <Text style={[typography.label, {color: theme.text, paddingTop: 8}]}>
          *중복 선택 할 수 있어요.
        </Text>
      </View>

      {/* --- 중앙 스크롤 컨텐츠 --- */}
      {/* ScrollView에 flex: 1을 적용하여 상단과 하단을 제외한 모든 공간을 차지하게 합니다. */}
      <ScrollView style={{flex: 1}}>
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
      </ScrollView>

      {/* --- 하단 고정 컨텐츠 --- */}
      {/* 버튼 영역을 ScrollView 밖으로 이동시켜 하단에 고정시킵니다. */}
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
        <Text style={[styles.text, {color: theme.text}]}>{interest.name}</Text>
      </View>

      <Image src={interest.image} style={styles.icon} />

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
    flex: 1, // 이 속성이 전체 레이아웃의 핵심입니다.
  },
  wrapper: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  contentWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
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
    position: 'relative',
  },
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
    // width: 40,
    // height: 40,
    // resizeMode: 'cover',
    // position: 'absolute',
    // bottom: 10,
    // right: 10,
    // [수정] 고정 픽셀 크기에서 비율 크기로 변경
    width: '40%',
    height: '40%',
    // [수정] 이미지가 잘리지 않고 비율에 맞게 조절되도록 'contain'으로 변경
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 110, 28, 0.9)',
    borderRadius: 10,
  },
});

export default Interest;
