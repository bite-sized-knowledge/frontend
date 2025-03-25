import {BaseButton} from '@/components/button';
import CustomHeader from '@/components/common/CustomHeader';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {NativeFunnelParamList, navigationParamName} from './signUpContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const Welcome = () => {
  const {theme} = useTheme();

  const route = useRoute<RouteProp<NativeFunnelParamList>>();
  const useFunnelState = route.params?.[navigationParamName]?.signUp?.context;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const start = () => {
    navigation.navigate('tabNav');
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.background, paddingBottom: insets.bottom},
      ]}>
      <CustomHeader title={''} />
      <View style={styles.contentWrapper}>
        <Text
          style={[typography.title, {color: theme.text}, styles.titleWrapper]}>
          {useFunnelState?.name ?? 'OOO'}님{'\n'}
          가입을 환영해요!
        </Text>
        <View style={styles.imageContainerWrapper}>
          <Image
            style={styles.imageWrapper}
            source={require('@assets/image/welcome.png')}
            width={180}
            height={180}
          />
        </View>
      </View>

      <BaseButton
        title={'시작하기'}
        textStyle={{color: theme.background}}
        style={[styles.buttonWapper, {backgroundColor: theme.main}]}
        onPress={start}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  titleWrapper: {
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  imageContainerWrapper: {
    flex: 1,
    padding: 100,
  },
  imageWrapper: {
    // marginVertical: 'auto',
  },
  buttonWapper: {
    marginTop: 'auto',
    marginHorizontal: 20,
  },
});
