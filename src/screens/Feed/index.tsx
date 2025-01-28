import React, {useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {Card} from '../../components/card/Card';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WebViewDrawer from '../../components/common/WebViewDrawer';

const feedApiRes = [
  {
    backgroundColor: 'black',
    article: {
      id: 1,
      title: '타이틀 텍스트',
      description: '서브 텍스트_한줄 요약',
      link: 'https://www.naver.com',
      thumbnail: 'https://picsum.photos/800/400?random=1',
      like_count: 1,
      archive_count: 1,
      isLike: true,
      isArchived: true,
      isSubscribed: true,
      category: ['Mobile', 'Web', 'DB'],
    },
    blog: {
      id: 0,
      favicon: 'https://picsum.photos/800/400?random=2',
      title: '작성자 정보',
    },
  },
  {
    backgroundColor: 'red',
    article: {
      id: 2,
      title: '타이틀 텍스트',
      description: '서브 텍스트_한줄 요약',
      link: '345',
      thumbnail: 'https://picsum.photos/800/400?random=1',
      like_count: 1,
      archive_count: 1,
      isLike: true,
      isArchived: true,
      isSubscribed: true,
      category: ['Mobile', 'Web', 'DB'],
    },
    blog: {
      id: 1,
      favicon: 'https://picsum.photos/800/400?random=2',
      title: '작성자 정보',
    },
  },
  {
    backgroundColor: 'white',
    article: {
      id: 3,
      title: '타이틀 텍스트',
      description: '서브 텍스트_한줄 요약',
      link: '',
      thumbnail: 'https://picsum.photos/800/400?random=1',
      like_count: 1,
      archive_count: 1,
      isLike: true,
      isArchived: true,
      isSubscribed: true,
      category: ['Mobile', 'Web', 'DB'],
    },
    blog: {
      id: 2,
      favicon: 'https://picsum.photos/800/400?random=2',
      title: '작성자 정보',
    },
  },
];

export const BOTTOM_TAB_HEIGHT = 56;
export const HEADER_HEIGHT = 64;
const screenHeight = Dimensions.get('window').height;

const FeedItem = ({item}) => {
  const insets = useSafeAreaInsets();

  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.bottom -
    insets.top;

  return (
    <View style={[styles.feedSection, {height: itemHeight}]}>
      <Card article={item.article} blog={item.blog} />
    </View>
  );
};

export const Feed = () => {
  return (
    <View style={styles.feeds}>
      <FlatList
        data={feedApiRes}
        renderItem={({item}) => <FeedItem item={item} />}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
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
  },
});
