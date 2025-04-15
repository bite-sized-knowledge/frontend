import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

interface Props {
  title: string;
  required?: boolean;
}

const CheckBoxLabel = ({title, required}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      {required && <Text style={styles.required}>(필수)</Text>}
      {required === false && <Text style={styles.optional}>(선택)</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    marginRight: 4,
  },
  required: {
    color: '#FF0000',
    fontSize: 12,
  },
  optional: {
    color: '#666666',
    fontSize: 12,
  },
});

export default CheckBoxLabel;
