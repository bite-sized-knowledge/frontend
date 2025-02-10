import {Blog} from '@/screens/Blog';
import {Feed} from '@/screens/Feed';
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

  const renderScene = ({route}: {route: Route}) => {
    switch (route.key) {
      case 'feed':
        return <Feed navigateToBlog={() => setIndex(1)} />;
      case 'blog':
        return <Blog navigateToFeed={() => setIndex(0)} />;
      default:
        return null;
    }
  };

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
