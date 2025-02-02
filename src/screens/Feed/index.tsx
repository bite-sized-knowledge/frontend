import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {Card} from '../../components/card/Card';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WebViewDrawer from '../../components/common/WebViewDrawer';
import {SceneMap, TabView} from 'react-native-tab-view';
import {Blog} from '../Blog';
import {BTab} from '../../navigator/BTab';
import {createStackNavigator} from '@react-navigation/stack';
import {useQuery} from '@tanstack/react-query';

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

const FeedItem = ({item, handleCardBodyClick}) => {
  const insets = useSafeAreaInsets();

  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.top -
    insets.bottom;

  return (
    <View style={[styles.feedSection, {height: itemHeight}]}>
      <Card
        article={item.article}
        blog={item.blog}
        handleCardBodyClick={handleCardBodyClick}
      />
    </View>
  );
};

export const Feed = () => {
  const [link, setLink] = useState<null | string>(null);

  const handleCardBodyClick = (data: string) => setLink(data);

  const getFeed = async () => {
    const data = await fetch('https://api.bite-knowledge.com/v1/feed').then(
      res => res.json(),
    );
    return data;
  };

  const {data} = useQuery({queryKey: ['feed'], queryFn: getFeed});

  return (
    <View style={styles.feeds}>
      <FlatList
        data={feedApiRes}
        renderItem={({item}) => (
          <FeedItem item={item} handleCardBodyClick={handleCardBodyClick} />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      />
      <WebViewDrawer
        isVisible={link !== null}
        url={link}
        onClose={() => setLink(null)}
      />
    </View>
  );
};

const renderScene = SceneMap({
  feed: BTab, // Feed 탭에 해당하는 컴포넌트
  blog: Blog, // Blog 탭에 Stack Navigator를 사용
});

const routes = [
  {key: 'feed', title: 'Feed'},
  {key: 'blog', title: 'Blog'},
];

export const FeedTab = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={() => null}
    />
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
