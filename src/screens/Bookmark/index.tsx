import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, Image, StyleSheet, FlatList, Pressable} from 'react-native';
import {typography} from '../../styles/tokens/typography';
import {elevation} from '../../styles/tokens/elevation';
import CustomHeader from '@/components/common/CustomHeader';
import {useTheme} from '@/context/ThemeContext';
import {Article} from '@/types/Article';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {jwtDecode} from 'jwt-decode';
import {getAccessToken} from '@/api/authApi';
import {UserInfo} from '@/navigator/RootStack';
import {useBookmarkedArticles} from '@/hooks/useBookmarkedArticles';

export const ROWS_PER_PAGE = 10;

interface ArticleProps {
  currentIndex: number;
  bookmarkArticle: Article;
}

export interface ArticleWithPlaceholder extends Article {
  isPlaceholder?: boolean;
}

const BookmarkedArticle = ({bookmarkArticle, currentIndex}: ArticleProps) => {
  const navigation = useNavigation();
  const {theme, themeMode} = useTheme();

  const uri =
    bookmarkArticle.thumbnail ||
    bookmarkArticle.category?.thumbnail ||
    bookmarkArticle.category?.image;

  return (
    <Pressable
      style={{flex: 1}}
      onPress={() =>
        navigation.navigate('bookmarkFeed', {
          currentIndex,
        })
      }>
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
              {bookmarkArticle.title}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const Bookmark = () => {
  const {theme, themeMode} = useTheme();
  const [jwtPayload, setJwtPayload] = useState<UserInfo | null>(null);
  // themeImages.ts
  const emptyBookmarkImages = {
    light: require('@assets/image/empty_bookmark_light.png'),
    dark: require('@assets/image/empty_bookmark_dark.png'),
  } as const;
  const imageSource = emptyBookmarkImages[themeMode];

  useEffect(() => {
    const fetchAndDecodeJWT = async () => {
      try {
        // AsyncStorage에 저장된 JWT 토큰 가져오기 (저장 키는 'jwtToken'으로 가정)
        const token = await getAccessToken();
        if (token) {
          // jwt-decode를 사용해 토큰 디코딩
          const decoded = jwtDecode<UserInfo>(token);

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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBookmarkedArticles();

  const isFocused = useIsFocused();

  // 화면이 포커스될 때만 재조회
  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  // pages 배열을 단일 배열로 펼치기
  const flatData = useMemo(() => {
    let data: ArticleWithPlaceholder[] =
      newBookmarkedArticles?.pages.flatMap(page => page?.articles ?? []) ?? [];

    if (data.length % 2 !== 0) {
      data.push({
        id: `${data.length + 1}`,
        isPlaceholder: true,
      } as ArticleWithPlaceholder);
    }
    return data;
  }, [newBookmarkedArticles]);

  // 끝에 다다르면 다음 페이지 요청
  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    return <BookmarkedArticle bookmarkArticle={item} currentIndex={index} />;
  };

  return (
    <View style={{backgroundColor: theme.background, flex: 1}}>
      <CustomHeader title={'Bookmark'} showBackButton={false} />

      {flatData.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={styles.image}
            source={imageSource}
            resizeMode="contain"
          />
          <View style={{gap: 4, alignItems: 'center'}}>
            <Text
              style={[typography.subHead, {color: theme.text, paddingTop: 42}]}>
              아직 북마크한 글이 없어요.
            </Text>
            <Text style={[typography.label, {color: theme.text}]}>
              메인화면에서 글을 저장해 쿠키 단지를 채워보세요!
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.blogSection}>
            <Image
              style={styles.blogImage}
              source={require('@assets/image/profileImage.png')}
            />
            <Text style={[typography.head, {color: theme.text}]}>
              {jwtPayload?.name}
            </Text>
          </View>

          <FlatList
            keyExtractor={item => item.id}
            data={flatData}
            numColumns={2}
            contentContainerStyle={[styles.gap, {padding: 16}]}
            columnWrapperStyle={styles.gap}
            renderItem={renderItem}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.6}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false} // 스크롤 표시 제거
          />
        </>
      )}
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
  article: {
    minWidth: 160,
    minHeight: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  articleHeader: {
    minHeight: 32,
    paddingVertical: 8,
    paddingHorizontal: 10,
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
  gap: {
    gap: 10,
  },
  image: {
    width: 189,
    height: 131,
    paddingLeft: 40,
  },
});
