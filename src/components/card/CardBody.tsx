import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {typography} from '../../styles/tokens/typography';
import {Article} from '../../types/Article';

interface CardBodyProps {
  article: Article;
}

export const CardBody: React.FC<CardBodyProps> = ({article}) => {
  return (
    <>
      <Image source={{uri: article.thumbnail}} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={[styles.titleContainer, typography.head]}>
          {article.title}
        </Text>
        <Text style={[styles.bodyContainer, typography.body]}>
          {article.description}
        </Text>
        <View style={styles.categoryContainer}>
          {article.category.map((tag, idx) => (
            <HashTag key={idx} tagName={tag} />
          ))}
        </View>
      </View>
    </>
  );
};

interface HashTagProps {
  tagName: string;
}

const HashTag = ({tagName}: HashTagProps) => {
  return (
    <View style={styles.categoryWrapper}>
      <Text style={[typography.caption, styles.categoryName]}>#{tagName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: 320,
    height: 160,
  },
  cardContent: {
    width: 320,
    height: 128,
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
    backgroundColor: '#E5E5E5',
    borderRadius: 16,
  },
  categoryName: {
    color: '#A2A2A2',
  },
});
