import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Article} from '@/types/Article';
import {useTheme} from '@/context/ThemeContext';
import {BOTTOM_TAB_HEIGHT, HEADER_HEIGHT, screenHeight} from '.';
import {Card} from '@/components/card/Card';

interface FeedItemProps {
  item: Article;
  handleCardBodyClick: (data: string) => void;
  handleCardHeaderClick: (blog: string) => void;
}

export const FeedItem = ({
  item,
  handleCardBodyClick,
  handleCardHeaderClick,
}: FeedItemProps) => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.top -
    insets.bottom;

  return (
    <View
      style={[
        styles.feedSection,
        {
          height: itemHeight,
          backgroundColor: theme.background,
        },
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

const styles = StyleSheet.create({
  feeds: {flex: 1},
  feedSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
  },
});
