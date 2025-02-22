import {Blog} from '@/screens/Blog';
import {BlogFeed} from '@/screens/Blog/BlogFeed';
import {Feed} from '@/screens/Feed';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {TabView} from 'react-native-tab-view';

interface Route {
  key: string;
  title: string;
}

const routes = [
  {key: 'feed', title: 'Feed'},
  {key: 'blog', title: 'Blog'},
];

export const FeedTab = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);
  const [blogId, setBlogId] = useState<string | null>(null);

  // onIndexChange 핸들러: blogId가 없으면 blog 탭으로 전환하지 않음
  const handleIndexChange = (newIndex: number) => {
    if (newIndex === 1 && !blogId) {
      return;
    }
    setIndex(newIndex);
  };

  const renderScene = ({route}: {route: Route}) => {
    switch (route.key) {
      case 'feed':
        return (
          <Feed
            // Feed에서 특정 blog의 아이디를 받아 blog 탭으로 전환
            navigateToBlog={() => {
              setIndex(1);
            }}
            setBlogId={(id: string | null) => {
              setBlogId(id);
            }}
          />
        );
      case 'blog':
        return (
          blogId && <Blog blogId={blogId} navigateToFeed={() => setIndex(0)} />
        );
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={handleIndexChange}
      initialLayout={{width: layout.width}}
      renderTabBar={() => null}
    />
  );
};

const Stack = createStackNavigator();

export const FeedStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="TabView"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={'TabView'} component={FeedTab} />
      <Stack.Screen name={'BlogFeed'} component={BlogFeed} />
    </Stack.Navigator>
  );
};
