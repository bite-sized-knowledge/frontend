import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ShortList from './src/screens/feed/ShortList';
import {ThemeProvider} from './src/context/ThemeContext';
import ThemeToggle from './src/components/common/ThemeToggle';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1, // 전체 화면을 차지하도록 flex: 1 추가
  };

  return (
    <ThemeProvider>
      <SafeAreaView style={backgroundStyle}>
        <ThemeToggle />
        <ShortList />
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default App;
