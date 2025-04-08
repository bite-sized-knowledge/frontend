import React, {useEffect, useState} from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import Icons from '@/assets/icons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {jwtDecode} from 'jwt-decode';
import {getAccessToken} from '@/api/authApi';
import {MY_SCREENS, MyStackParamList} from '@/types/constants/myScreens';

export interface JWT {
  sub: string;
  name: string;
  birth: number;
  email: string;
  status: string;
}

export const My = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NavigationProp<MyStackParamList>>();
  const [jwtPayload, setJwtPayload] = useState<JWT>();

  useEffect(() => {
    const fetchAndDecodeJWT = async () => {
      try {
        // AsyncStorage에 저장된 JWT 토큰 가져오기 (저장 키는 'jwtToken'으로 가정)
        const token = await getAccessToken();
        if (token) {
          // jwt-decode를 사용해 토큰 디코딩
          const decoded = jwtDecode(token);

          setJwtPayload(decoded!);
        }
      } catch (error) {
        console.error('JWT 디코딩 에러:', error);
      }
    };

    fetchAndDecodeJWT();
  }, []);

  const navigateToDetail = () => {
    if (jwtPayload) {
      navigation.navigate(MY_SCREENS.MY_DETAIL, {jwtPayload});
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <CustomHeader title={'MY'} showBackButton={false} />
      <View style={styles.profileSection}>
        <Image style={styles.profileImage} />
        <Text
          style={[typography.head, {color: theme.text}, styles.profileName]}>
          {/* {blog?.data?.title} */}
          {jwtPayload?.name}
        </Text>
        <Pressable onPress={navigateToDetail}>
          <Icons.ArrowRight />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 60,
    backgroundColor: '#d9d9d9',
  },
  profileName: {
    flexGrow: 1,
  },
});
