import React from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import Icons from '@/assets/icons';
import {useNavigation} from '@react-navigation/native';

export const Withdraw = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const navigateToDetail = () => {
    navigation.navigate('WithdrawDetail', {});
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <CustomHeader title={'탈퇴하기'} showBackButton={true} />
      <View style={styles.profileSection}>
        <Text
          style={[typography.subHead, {color: theme.text}, styles.profileName]}>
          탈퇴하는 이유를 선택해주세요.
        </Text>
      </View>
      <View style={styles.profileSection}>
        <Text
          style={[typography.body, {color: theme.text}, styles.profileName]}>
          더 이상 사용하지 않아요.
        </Text>
        <Icons.ArrowRight onPress={navigateToDetail} />
      </View>
      <View style={styles.profileSection}>
        <Text
          style={[typography.body, {color: theme.text}, styles.profileName]}>
          원하는 정보가 없어요.
        </Text>
        <Icons.ArrowRight onPress={navigateToDetail} />
      </View>
      <View style={styles.profileSection}>
        <Text
          style={[typography.body, {color: theme.text}, styles.profileName]}>
          개인정보 유출이 걱정돼요.
        </Text>
        <Icons.ArrowRight onPress={navigateToDetail} />
      </View>
      <View style={styles.profileSection}>
        <Text
          style={[typography.body, {color: theme.text}, styles.profileName]}>
          기타
        </Text>
        <Icons.ArrowRight onPress={navigateToDetail} />
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
