import React from 'react';
import Icons from '@/assets/icons';
import {View, StyleSheet, Pressable, Image, Text} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';

import {useTheme} from '@/context/ThemeContext';
import {BaseButton} from '@/components/button';
import {typography} from '@/styles/tokens/typography';
import {ROOT_SCREENS, RootStackParamList} from '@/types/constants/rootScreens';

export default function MemberModal() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {theme} = useTheme();

  const handleLogin = () => {
    // navigation.reset({
    //   routes: [{name: ROOT_SCREENS.AUTH}],
    // });
    navigation.goBack();

    navigation.navigate(ROOT_SCREENS.AUTH);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: theme.background,
          width: 320,
          height: 336,
          borderRadius: 20,
          overflow: 'hidden',
        }}>
        <View
          style={{
            marginLeft: 'auto',
            width: 48,
            height: 48,
            padding: 12,
          }}>
          <Pressable onPress={handleCancel}>
            <Icons.Close color={theme.text} />
          </Pressable>
        </View>
        <View style={styles.container}>
          <Image
            style={{paddingBottom: 16}}
            source={require('../../assets/image/login.png')}
          />
          <Text style={[typography.body, {color: theme.text}]}>
            로그인하고 더 많은
            {'\n'}
            기능을 이용해보세요!
          </Text>
        </View>

        <View style={{padding: 20}}>
          <BaseButton
            title={'로그인'}
            textStyle={(typography.subHead, {color: theme.background})}
            style={{backgroundColor: theme.main}}
            onPress={handleLogin}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
