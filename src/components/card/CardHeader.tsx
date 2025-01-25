import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {Blog} from '../../types/Blog';
import {MeatBallButton} from '../common/MeatBallButton';
import {typography} from '../../styles/tokens/typography';

interface CardHeaderProps {
  blog: Blog;
}

export const CardHeader: React.FC<CardHeaderProps> = ({blog}) => {
  return (
    <View style={styles.cardHeaderContainer}>
      <Profile key={blog.id} profile={blog} />
      <MeatBallButton />
    </View>
  );
};

interface ProfileProps {
  profile: Pick<Blog, 'favicon' | 'title'>;
}

const Profile: React.FC<ProfileProps> = ({profile}) => {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.faviconWrapper}>
        <Image source={{uri: profile.favicon}} style={styles.favicon} />
      </View>
      <Text style={[typography.body, styles.profileName]}>{profile.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardHeaderContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    flexGrow: 1,
  },
  faviconWrapper: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#d9d9d9',
    overflow: 'hidden',
  },
  favicon: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    color: '#b1b1b1',
  },
});
