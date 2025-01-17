import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SavedShortsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>저장된 쇼츠</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
});

export default SavedShortsScreen;
