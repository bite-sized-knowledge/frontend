import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Article} from '../../types/Article';
import {useTheme} from '../../context/ThemeContext';
import {useMutation} from '@tanstack/react-query';
import {
  addBookmark,
  deleteBookmark,
  like,
  share,
  unlike,
} from '../../api/articleApi';
import {typography} from '../../styles/tokens/typography';

interface CardBottomProps {
  article: Article;
}

export const CardFooter: React.FC<CardBottomProps> = ({article}) => {
  const [liked, setLiked] = useState<boolean>(article.liked);
  const [num, setNum] = useState(article.likeCount);
  const [bookmarked, setBookmarked] = useState<boolean>(article.archived);

  const {mutate: likeMutation} = useMutation({
    mutationFn: () => like(article.id),
    onSuccess: () => {
      setLiked(true);
      setNum(num + 1);
    },
  });

  const {mutate: unlikeMutation} = useMutation({
    mutationFn: () => unlike(article.id),
    onSuccess: () => {
      setLiked(false);
      setNum(num - 1);
    },
  });

  const sharePost = useMutation({
    mutationFn: () => share(article.id),
    onError: error => {},
  });

  const {mutate: bookmarkMutation} = useMutation({
    mutationFn: () => addBookmark(article.id),
    onSuccess: () => setBookmarked(true),
  });
  const {mutate: cancelBookmarkMutation} = useMutation({
    mutationFn: () => deleteBookmark(article.id),
    onSuccess: () => setBookmarked(false),
  });

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.leftSection}>
        <ReactionButton
          icon={'좋아요'}
          isReactioned={liked}
          reactionCount={num}
          handlePress={async () => (liked ? unlikeMutation() : likeMutation())}
        />
        <ReactionButton icon={'공유'} handlePress={() => {}} />
      </View>
      <View style={styles.rightSection}>
        <ReactionButton
          icon={'아카이빙'}
          isReactioned={article.archived}
          handlePress={async () =>
            bookmarked ? cancelBookmarkMutation() : bookmarkMutation()
          }
        />
      </View>
    </View>
  );
};

interface ReactionButtonProps {
  icon: string;
  isReactioned?: boolean;
  reactionCount?: number;
  handlePress: () => {};
}

// TODO(권대현): 아이콘 대체
const ReactionButton: React.FC<ReactionButtonProps> = ({
  icon,
  isReactioned,
  reactionCount = 0,
  handlePress,
}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.reactionButtonContainer}>
      <Pressable onPress={handlePress}>
        <View style={styles.icon} />
      </Pressable>
      {reactionCount > 0 ? (
        <Text style={[typography.body, {color: theme.text}]}>
          {reactionCount}
        </Text>
      ) : null}
    </View>
  );
};

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
    backgroundColor: '#505050',
  },
  reactionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
