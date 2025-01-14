import React from 'react';
import {View, StyleSheet} from 'react-native';
import ShortList from './src/screens/feed/ShortList';
import {ThemeProvider} from './src/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <View style={styles.container}>
        <ShortList />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh', // 웹 환경에서 전체 높이 사용
    backgroundColor: '#fff',
  },
});

export default App;
