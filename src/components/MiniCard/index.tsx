import React from 'react';
import {useTheme} from '@/context/ThemeContext';
import {elevation} from '@/styles/tokens/elevation';
import {typography} from '@/styles/tokens/typography';
import {Article} from '@/types/Article';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

interface ArticleProps {
  article: Article;
  isPlaceholder?: boolean;
  onPress: () => void;
}

export const MiniCard = ({article, isPlaceholder, onPress}: ArticleProps) => {
  const {theme, themeMode} = useTheme();

  const uri =
    article.thumbnail || article.category?.thumbnail || article.category?.image;

  if (isPlaceholder) {
    return (
      <View style={{flex: 1}}>
        <View style={[styles.article, {backgroundColor: 'transparent'}]} />
      </View>
    );
  }

  return (
    <Pressable style={{flex: 1}} onPress={onPress}>
      <View
        style={[
          elevation.card,
          {
            backgroundColor:
              themeMode === 'light' ? theme.background : theme.gray4,
            // 아래 css에서 card에서 정의한 border-radius 엎어침
            borderRadius: 8,
          },
        ]}>
        <View style={styles.article}>
          <Image
            style={styles.articleImage}
            source={
              uri
                ? {uri: uri}
                : require('../../assets/image/default_thumbnail.png')
            }
            resizeMode="cover"
          />
          <View style={[styles.articleTitle]}>
            <Text
              style={[typography.body, {color: theme.text}]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {article.title}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  article: {
    minWidth: 160,
    minHeight: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 80,
    overflow: 'hidden',
  },
  articleTitle: {
    padding: 8,
    height: 68,
    justifyContent: 'center',
  },
});
