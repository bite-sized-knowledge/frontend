import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {lightTheme, darkTheme} from '../../styles/theme';

const {width, height} = Dimensions.get('window');

const ShortItem = ({item, onPress}) => {
  const {isDark} = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const handlePress = () => {
    if (onPress && item.url) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: theme.background}]}
      onPress={handlePress}
      activeOpacity={0.9}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBackground,
            shadowColor: theme.shadowColor,
          },
        ]}>
        <Image source={{uri: item.thumbnail}} style={styles.thumbnail} />
        <Text style={[styles.title, {color: theme.text}]}>{item.title}</Text>
        <Text style={[styles.description, {color: theme.text}]}>
          {item.description}
        </Text>
        <Text style={[styles.author, {color: theme.subText}]}>
          {item.author}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnail: {
    width: '90%',
    height: '40%',
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
});

export default ShortItem;
