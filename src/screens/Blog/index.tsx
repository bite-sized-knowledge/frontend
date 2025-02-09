import React from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import {typography} from '../../styles/tokens/typography';
import {elevation} from '../../styles/tokens/elevation';
import CustomHeader from '@/components/common/CustomHeader';

const Article = () => {
  return (
    <View style={[styles.article, elevation.card]}>
      <Image style={styles.articleImage} />
      <View style={[styles.articleTitle]}>
        <Text>123</Text>
      </View>
    </View>
  );
};

const data = [1, 2, 3, 4];

interface BlogProps {
  navigateToFeed: Function;
}

export const Blog = ({navigateToFeed}: BlogProps) => {
  return (
    <View>
      <CustomHeader
        title={'작성자 게시글'}
        showBackButton={true}
        onBackPress={() => navigateToFeed()}
      />
      <View style={styles.blogSection}>
        <Image style={styles.blogImage} />
        <Text style={typography.head}>123</Text>
      </View>
      <View style={styles.articleSection}>
        <FlatList
          data={data}
          numColumns={2}
          contentContainerStyle={{
            gap: 10,
          }}
          columnWrapperStyle={{
            gap: 10,
          }}
          renderItem={() => <Article />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  blogSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  blogImage: {
    width: 48,
    height: 48,
    borderRadius: 60,
    backgroundColor: '#d9d9d9',
  },
  articleSection: {
    padding: 16,
    paddingBottom: 0,
    height: '100%',
    backgroundColor: 'blue',
  },
  article: {
    minWidth: 160,
    minHeight: 160,
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
  },
  articleImage: {
    height: 80,
    backgroundColor: 'red',
    overflow: 'hidden',
  },
  articleTitle: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
