import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {BTab} from './src/navigator/BTab';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import {BNavigation} from './src/navigator/BNavigation';

function App(): React.JSX.Element {
  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'blue',
  };

  return (
    // <SafeAreaView style={backgroundStyle}>
    <SafeAreaProvider>
      <StatusBar />
      <NavigationContainer>
        <BTab />
        {/* <BNavigation /> */}
      </NavigationContainer>
    </SafeAreaProvider>
    // </SafeAreaView>
  );
}

export default App;
