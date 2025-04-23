import React, {useState} from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import Icons from '@/assets/icons';
import {BaseButton} from '@/components/button';
import {useWithdraw} from '@/hooks/useWithdraw';

export const WithdrawDetail = () => {
  const {theme} = useTheme();
  const [checked, setChecked] = useState(false);
  const {mutate: withdrawAccount} = useWithdraw();

  const onPressWithdraw = () => {
    withdrawAccount();
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <CustomHeader title={'탈퇴하기'} showBackButton={true} />
      <View style={styles.profileSection}>
        <Text
          style={[typography.subHead, {color: theme.text}, styles.profileName]}>
          탈퇴 전 꼭 확인해주세요.
        </Text>
      </View>
      <View style={styles.profileSection}>
        <Text
          style={[typography.body, {color: theme.text}, styles.profileName]}>
          계정 탈퇴 시, 앱 내의 모든 기록이 삭제됩니다.{'\n'}
          (개인 정보, 좋아요, 북마크 등){'\n'}
          이전 기록에 대한 재복구는 불가능합니다.
        </Text>
      </View>
      <View style={[styles.profileSection, {marginTop: 'auto'}]}>
        <Pressable onPress={() => setChecked(prev => !prev)}>
          {checked ? <Icons.BoxChecked /> : <Icons.Box />}
        </Pressable>
        <Text
          style={[typography.body, {color: theme.gray3}, styles.profileName]}>
          안내사항을 모두 확인하였습니다.
        </Text>
      </View>
      <View style={[{padding: 20}]}>
        {checked ? (
          <BaseButton
            title={'확인'}
            style={[{backgroundColor: theme.main}]}
            textStyle={{color: theme.background}}
            onPress={onPressWithdraw}
          />
        ) : (
          <BaseButton
            title={'확인'}
            style={[{backgroundColor: theme.gray4}]}
            textStyle={{color: theme.text}}
          />
        )}
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
