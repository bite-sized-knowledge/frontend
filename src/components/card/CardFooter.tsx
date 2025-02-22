import React, {ReactNode, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@context/ThemeContext';
import {typography} from '@styles/tokens/typography';
import Icons from '../../assets/icons';
import {Article} from 'types/Article';
import {
  useLikeMutation,
  useUnlikeMutation,
  useShareMutation,
  useBookmarkMutation,
  useCancelBookmarkMutation,
} from '@hooks/useArticleMutations';

interface CardBottomProps {
  article: Article;
}

export const CardFooter: React.FC<CardBottomProps> = ({article}) => {
  // 로컬 상태(낙관적 업데이트 용)
  const [liked, setLiked] = useState<boolean>(article.liked);
  const [likeCount, setLikeCount] = useState<number>(article.likeCount);
  const [bookmarked, setBookmarked] = useState<boolean>(article.archived);
  const [shareCount, setShareCount] = useState<number>(article.shareCount);
  const [isShared, setIsShared] = useState<boolean>(false);

  // 훅을 통한 API 호출
  const {mutate: likeMutation} = useLikeMutation(article.id, () => {
    setLiked(true);
    setLikeCount(prev => prev + 1);
  });
  const {mutate: unlikeMutation} = useUnlikeMutation(article.id, () => {
    setLiked(false);
    setLikeCount(prev => prev - 1);
  });
  const {mutate: shareMutation} = useShareMutation(article.id, {
    onSuccess: () => {
      if (!isShared) {
        setShareCount(prev => prev + 1);
        setIsShared(true);
      }
    },
  });
  const {mutate: bookmarkMutation} = useBookmarkMutation(article.id, () =>
    setBookmarked(true),
  );
  const {mutate: cancelBookmarkMutation} = useCancelBookmarkMutation(
    article.id,
    () => setBookmarked(false),
  );

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.leftSection}>
        <ReactionButton
          icon={liked ? <Icons.HeartFill /> : <Icons.HeartDefault />}
          reactionCount={likeCount}
          handlePress={async () => (liked ? unlikeMutation() : likeMutation())}
        />
        <ReactionButton
          icon={<Icons.Share />}
          reactionCount={shareCount}
          handlePress={async () => shareMutation()}
        />
      </View>
      <View style={styles.rightSection}>
        <ReactionButton
          icon={bookmarked ? <Icons.CookieFill /> : <Icons.CookieDefault />}
          handlePress={async () =>
            bookmarked ? cancelBookmarkMutation() : bookmarkMutation()
          }
        />
      </View>
    </View>
  );
};

interface ReactionButtonProps {
  icon: ReactNode;
  reactionCount?: number;
  handlePress: () => {};
}

/**
 * ReactionButton 컴포넌트는 아이콘과 반응(좋아요 개수 등)을 표시하며,
 * React.memo로 감싸 불필요한 리렌더링을 방지합니다.
 */
const ReactionButton: React.FC<ReactionButtonProps> = React.memo(
  ({icon, reactionCount = 0, handlePress}) => {
    const {theme} = useTheme();

    return (
      <View style={styles.reactionButtonContainer}>
        <Pressable onPress={handlePress} style={styles.icon}>
          {icon}
        </Pressable>
        {reactionCount > 0 ? (
          <Text style={[typography.body, {color: theme.text}]}>
            {reactionCount}
          </Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  bottomContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 12,
    paddingRight: 12,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexGrow: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  reactionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
