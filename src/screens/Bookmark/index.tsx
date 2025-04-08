import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList, Pressable} from 'react-native';
import {typography} from '../../styles/tokens/typography';
import {elevation} from '../../styles/tokens/elevation';
import CustomHeader from '@/components/common/CustomHeader';
import {useQuery} from '@tanstack/react-query';
import {useTheme} from '@/context/ThemeContext';
import {Article} from '@/types/Article';
import {useNavigation} from '@react-navigation/native';
import {getBookmarkedArticles} from '@/api/articleApi';
import {jwtDecode} from 'jwt-decode';
import {getAccessToken} from '@/api/authApi';
import {mergeWithoutDuplicates} from '@/util/utils';

export const ROWS_PER_PAGE = 10;

interface ArticleProps {
  totalArticles: Article[];
  currentIndex: number;
  next: string | null;
  blogArticle: Article;
}

const BookmarkedArticle = ({
  blogArticle,
  totalArticles,
  currentIndex,
  next,
}: ArticleProps) => {
  const navigation = useNavigation();
  const {theme, themeMode} = useTheme();

  return (
    <Pressable
      style={{flex: 1}}
      onPress={() =>
        navigation.navigate('bookmarkFeed', {
          totalArticles,
          currentIndex,
          next,
        })
      }>
      <View
        style={[
          elevation.card,
          {
            backgroundColor:
              themeMode === 'light' ? theme.background : theme.gray4,
          },
        ]}>
        <View style={styles.article}>
          <View style={styles.articleHeader}>
            <Text style={[typography.body]}>{blogArticle.blog.title}</Text>
          </View>
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

export const Bookmark = () => {
  const {theme} = useTheme();
  // 해당 쿼리키만 따로 관리하는 이유는 블로그 ID가 바뀔 때 next를 초기화시키고 재조회하기 위해 따로 관리함. 그냥 사용하면 재조회 이후 next값이 수정됨.
  const [queryKey, setQueryKey] = useState(['bookmarkArticles']);
  const [blogArticles, setBlogArticles] = useState<Article[]>([]);
  const [next, setNext] = useState<string | null>(null);

  const [jwtPayload, setJwtPayload] = useState();

  useEffect(() => {
    const fetchAndDecodeJWT = async () => {
      try {
        // AsyncStorage에 저장된 JWT 토큰 가져오기 (저장 키는 'jwtToken'으로 가정)
        const token = await getAccessToken();
        if (token) {
          // jwt-decode를 사용해 토큰 디코딩
          const decoded = jwtDecode(token);

          setJwtPayload(decoded!);
        }
      } catch (error) {
        console.error('JWT 디코딩 에러:', error);
      }
    };

    fetchAndDecodeJWT();
  }, []);

  const {
    data: newBookmarkedArticles,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => getBookmarkedArticles(ROWS_PER_PAGE, next),
  });

  // 새로운 데이터가 로드되면 기존 데이터에 추가
  useEffect(() => {
    if (newBookmarkedArticles) {
      setBlogArticles(
        mergeWithoutDuplicates(blogArticles, newBookmarkedArticles.articles),
      );
      setNext(newBookmarkedArticles?.next ?? null);
    }
  }, [newBookmarkedArticles]);

  const onEndReached = () => {
    if (!isRefetching && !isLoading && next) {
      refetch();
    }
  };

  return (
    <View style={{backgroundColor: theme.background, flex: 1}}>
      <CustomHeader title={'Bookmark'} showBackButton={false} />
      <View style={styles.blogSection}>
        <Image style={styles.blogImage} />
        <Text style={[typography.head, {color: theme.text}]}>
          {jwtPayload?.name}
        </Text>
      </View>
      <FlatList
        style={styles.articleSection}
        keyExtractor={item => item.id}
        data={blogArticles}
        numColumns={2}
        contentContainerStyle={styles.gap}
        columnWrapperStyle={styles.gap}
        renderItem={article => (
          <BookmarkedArticle
            blogArticle={article.item}
            totalArticles={blogArticles.map(article => {
              return {...article};
            })}
            currentIndex={article.index}
            next={next}
          />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false} // 스크롤 표시 제거
      />
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
    flex: 1,
  },
  article: {
    minWidth: 160,
    minHeight: 192,
    borderRadius: 8,
    overflow: 'hidden',
  },
  articleHeader: {
    minHeight: 32,
    paddingVertical: 8,
    paddingHorizontal: 10,
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
