import React from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icons from '@/assets/icons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '@/types/constants/rootScreens';
import {useAuth} from '@/hooks/useAuth';
import {MY_SCREENS, MyStackParamList} from '@/types/constants/myScreens';

export const MyDetail = ({route}) => {
  const {theme} = useTheme();
  const navigation =
    useNavigation<NavigationProp<RootStackParamList & MyStackParamList>>();
  const {jwtPayload} = route.params;
  const {logout} = useAuth();

  const goToWithdraw = async () => {
    navigation.navigate(MY_SCREENS.WITHDRAW);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <CustomHeader title={''} showBackButton={true} />
      <View style={[styles.listItemWrapper, {borderBottomColor: theme.gray4}]}>
        <Text
          style={[styles.textWrapper, typography.subHead, {color: theme.text}]}>
          계정 관리
        </Text>
      </View>
      <View style={[styles.listItemWrapper, {borderBottomColor: theme.gray4}]}>
        <Text
          style={[styles.textWrapper, typography.body, {color: theme.text}]}>
          Google
          {'\n'}
          <Text style={[typography.caption, {color: theme.gray3}]}>
            {jwtPayload.email}
          </Text>
        </Text>
        <Icons.ArrowRight />
      </View>
      <View style={[styles.listItemWrapper, {borderBottomColor: theme.gray4}]}>
        <Text
          style={[styles.textWrapper, typography.body, {color: theme.text}]}>
          로그아웃
        </Text>
        <Pressable onPress={logout}>
          <Icons.ArrowRight />
        </Pressable>
      </View>
      <View style={[styles.buttonItemWrapper]}>
        <Pressable onPress={goToWithdraw}>
          <Text
            style={[
              typography.caption,
              {color: theme.gray3, textDecorationLine: 'underline'},
            ]}>
            탈퇴하기
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItemWrapper: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  buttonItemWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 'auto',
    alignItems: 'center',
  },
  textWrapper: {
    flexGrow: 1,
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
