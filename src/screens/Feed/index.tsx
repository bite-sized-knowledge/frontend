import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Card} from '@/components/card/Card';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useQuery} from '@tanstack/react-query';
import {useTheme} from '@/context/ThemeContext';
import {getFeed} from '@/api/feedApi';
import CustomHeader from '@/components/common/CustomHeader';
import {WebViewDrawer} from '@/components/common/WebViewDrawer';

export const BOTTOM_TAB_HEIGHT = 56;
export const HEADER_HEIGHT = 64;
const screenHeight = Dimensions.get('window').height;

interface FeedItemProps {
  item: any;
  handleCardBodyClick: Function;
  handleCardHeaderClick: Function;
}

const FeedItem = ({
  item,
  handleCardBodyClick,
  handleCardHeaderClick,
}: FeedItemProps) => {
  const insets = useSafeAreaInsets();

  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.top -
    insets.bottom;

  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.feedSection,
        {height: itemHeight},
        {backgroundColor: theme.background},
      ]}>
      <Card
        article={{...item}}
        blog={item.blog}
        handleCardBodyClick={handleCardBodyClick}
        handleCardHeaderClick={handleCardHeaderClick}
      />
    </View>
  );
};

interface FeedProps {
  navigateToBlog: Function;
}

export const Feed = ({navigateToBlog}: FeedProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [link, setLink] = useState<null | string>(null);
  const {theme} = useTheme();

  const handleCardBodyClick = (data: string) => setLink(data);

  // React Query로 데이터 가져오기
  const {data, isLoading, isError, error} = useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
  });

  // 로딩, 에러 처리
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.feeds, {backgroundColor: theme.background}]}>
      <CustomHeader title={'Feed'} />
      <FlatList
        data={data?.data?.result ?? []}
        renderItem={({item}) => (
          <FeedItem
            item={item}
            handleCardBodyClick={handleCardBodyClick}
            handleCardHeaderClick={navigateToBlog}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      />
      <WebViewDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        uri={link}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  feeds: {flex: 1},
  feedSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
