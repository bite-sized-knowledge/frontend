import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {typography} from '../../styles/tokens/typography';
import {Article} from '../../types/Article';
import {useTheme} from '../../context/ThemeContext';

interface CardBodyProps {
  article: Article;
  handleCardBodyClick: Function;
}

export const CardBody: React.FC<CardBodyProps> = ({
  article,
  handleCardBodyClick,
}) => {
  const {theme} = useTheme();

  return (
    <Pressable onPress={() => handleCardBodyClick(article.id)}>
      <Image source={{uri: article.thumbnail}} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text
          style={[styles.titleContainer, typography.head, {color: theme.text}]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {article.title}
        </Text>
        <Text
          style={[styles.bodyContainer, typography.body, {color: theme.gray1}]}
          numberOfLines={3}
          ellipsizeMode="tail">
          {article.description}
        </Text>
        <View style={styles.categoryContainer}>
          {article.categories &&
            article.categories.map((tag, idx) => (
              <HashTag key={idx} tagName={tag} />
            ))}
        </View>
      </View>
    </Pressable>
  );
};

interface HashTagProps {
  tagName: string;
}

const HashTag = ({tagName}: HashTagProps) => {
  const {theme} = useTheme();
  return (
    <View style={[styles.categoryWrapper, {backgroundColor: theme.gray4}]}>
      <Text style={[typography.caption, {color: theme.sub}]}>#{tagName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    minWidth: 320,
    minHeight: 160,
  },
  cardContent: {
    minWidth: 320,
    minHeight: 128,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },

  titleContainer: {
    marginBottom: 8,
  },
  bodyContainer: {
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
    flexWrap: 'wrap',
  },
  categoryWrapper: {
    height: 24,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'baseline',
    borderRadius: 16,
  },
  webview: {
    flex: 1,
  },
});
