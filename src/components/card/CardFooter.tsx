import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Article} from '../../types/Article';

interface CardBottomProps {
  article: Article;
}

export const CardFooter: React.FC<CardBottomProps> = ({article}) => {
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.leftSection}>
        <ReactionButton
          icon={'좋아요'}
          isReactioned={article.isLike}
          reactionCount={article.like_count}
        />
        <ReactionButton icon={'공유'} />
      </View>
      <View style={styles.rightSection}>
        <ReactionButton icon={'아카이빙'} isReactioned={article.isArchived} />
      </View>
    </View>
  );
};

interface ReactionButtonProps {
  icon: string;
  isReactioned?: boolean;
  reactionCount?: number;
}

// TODO(권대현): 아이콘 대체
const ReactionButton: React.FC<ReactionButtonProps> = ({
  icon,
  isReactioned,
  reactionCount = 0,
}) => {
  return (
    <View style={styles.reactionButtonContainer}>
      <View style={styles.icon} />
      {reactionCount > 0 ? <Text>{reactionCount}</Text> : null}
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
