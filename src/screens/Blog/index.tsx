import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList, Pressable} from 'react-native';
import {typography} from '../../styles/tokens/typography';
import {elevation} from '../../styles/tokens/elevation';
import CustomHeader from '@/components/common/CustomHeader';
import {getBlog, getBlogArticle} from '@/api/blogApi';
import {useQuery} from '@tanstack/react-query';
import {useTheme} from '@/context/ThemeContext';
import {Article} from '@/types/Article';
import {useNavigation} from '@react-navigation/native';
import {Blog as BlogType} from '@/types/Blog';
import {mergeWithoutDuplicates} from '@/util/utils';
import {EVENT_TYPE, sendEvent, TARGET_TYPE} from '@/api/eventApi';
import {ArticleWithPlaceholder} from '../Bookmark';

export const ROWS_PER_PAGE = 10;

interface ArticleProps {
  totalArticles: Article[];
  currentIndex: number;
  next: string | null;
  blogArticle: Article;
}

const BlogArticle = ({
  blogArticle,
  totalArticles,
  currentIndex,
  next,
}: ArticleProps) => {
  const navigation = useNavigation();
  const {theme, themeMode} = useTheme();

  const navigateToFeed = () => {
    navigation.navigate('BlogFeed', {
      totalArticles,
      currentIndex,
      next,
    });

    sendEvent(TARGET_TYPE.BLOG, blogArticle.id, EVENT_TYPE.BLOG_TO_ARTICLE);
  };

  return (
    <Pressable style={styles.flex1} onPress={navigateToFeed}>
      <View
        style={[
          elevation.card,
          {
            backgroundColor:
              themeMode === 'light' ? theme.background : theme.gray4,
          },
        ]}>
        <View style={styles.article}>
          <Image
            style={styles.articleImage}
            source={{uri: blogArticle.thumbnail}}
          />
          <View style={[styles.articleTitle]}>
            <Text
              style={[typography.body, {color: theme.text}]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {blogArticle.title}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

interface BlogProps {
  blogId: string;
  navigateToFeed: Function;
}

export const Blog = ({navigateToFeed, blogId}: BlogProps) => {
  const {theme} = useTheme();
  // 해당 쿼리키만 따로 관리하는 이유는 블로그 ID가 바뀔 때 next를 초기화시키고 재조회하기 위해 따로 관리함. 그냥 사용하면 재조회 이후 next값이 수정됨.
  const [queryKey, setQueryKey] = useState(['blogArticles', blogId]);
  const [blogArticles, setBlogArticles] = useState<ArticleWithPlaceholder[]>(
    [],
  );
  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    setNext(null);
    setBlogArticles([]);
    setQueryKey(['blogArticles', blogId]);
  }, [blogId]);

  // React Query로 데이터 가져오기
  const {data: blog} = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => getBlog(blogId),
  });

  const {
    data: newBlogArticles,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => getBlogArticle(blogId, ROWS_PER_PAGE, next),
    enabled: blogId !== null,
  });

  // 새로운 데이터가 로드되면 기존 데이터에 추가
  useEffect(() => {
    if (newBlogArticles) {
      const data = mergeWithoutDuplicates(
        blogArticles,
        newBlogArticles?.articles,
      );

      if (data.length % 2 === 1) {
        data.push({
          id: data.length + 1,
          isPlaceholder: true,
        });
      }

      setBlogArticles(data);
      setNext(newBlogArticles?.next ?? null);
    }
  }, [newBlogArticles]);

  const onEndReached = () => {
    if (!isRefetching && !isLoading && next) {
      refetch();
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ArticleWithPlaceholder;
    index: number;
  }) => {
    if (item.isPlaceholder) {
      return (
        <View style={{flex: 1}}>
          <View style={[styles.article, {backgroundColor: 'transparent'}]} />
        </View>
      );
    }
    return (
      <BlogArticle
        blogArticle={item}
        totalArticles={blogArticles.filter(article => !article.isPlaceholder)}
        currentIndex={index}
        next={next}
      />
    );
  };

  return (
    <View style={[styles.flex1, {backgroundColor: theme.background}]}>
      <CustomHeader
        title={'작성자 게시글'}
        showBackButton={true}
        onBackPress={() => navigateToFeed()}
      />
      <View style={styles.blogSection}>
        <Image style={styles.blogImage} source={{uri: blog?.data?.favicon}} />
        <Text style={[typography.head, {color: theme.text}]}>
          {blog?.data?.title}
        </Text>
      </View>
      <FlatList
        style={styles.articleSection}
        keyExtractor={item => item.id}
        data={blogArticles}
        numColumns={2}
        contentContainerStyle={styles.gap}
        columnWrapperStyle={styles.gap}
        // renderItem={article => (
        //   <BlogArticle
        //     blogArticle={article.item}
        //     totalArticles={blogArticles}
        //     currentIndex={article.index}
        //     next={next}
        //   />
        // )}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false} // 스크롤 표시 제거
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
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
    flex: 1,
  },
  article: {
    minWidth: 160,
    minHeight: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  articleImage: {
    height: 80,
    overflow: 'hidden',
  },
  articleTitle: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  gap: {
    gap: 10,
  },
});
