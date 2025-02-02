import React from 'react';
import {StyleSheet, View, Image, Text, Pressable} from 'react-native';
import {Blog} from '../../types/Blog';
import {MeatBallButton} from '../common/MeatBallButton';
import {typography} from '../../styles/tokens/typography';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';

interface CardHeaderProps {
  blog: Blog;
}

export const CardHeader: React.FC<CardHeaderProps> = ({blog}) => {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => navigation.navigate('blog')}>
      <View style={styles.cardHeaderContainer}>
        <Profile key={blog.id} profile={blog} />
        <MeatBallButton />
      </View>
    </Pressable>
  );
};

interface ProfileProps {
  profile: Pick<Blog, 'favicon' | 'title'>;
}

const Profile: React.FC<ProfileProps> = ({profile}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.profileContainer}>
      <View style={styles.faviconWrapper}>
        <Image source={{uri: profile.favicon}} style={styles.favicon} />
      </View>
      <Text style={[typography.body, {color: theme.gray1}]}>
        {profile.title}
      </Text>
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
});
