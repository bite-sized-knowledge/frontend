import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ThemeProvider} from './src/context/ThemeContext';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1, // 전체 화면을 차지하도록 flex: 1 추가
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <NavigationContainer>
        <ThemeProvider>
          <BottomTabNavigator />
        </ThemeProvider>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
