import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type HeaderProps = {
  title: string;
};

const BHeader = ({title}: HeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default BHeader;
