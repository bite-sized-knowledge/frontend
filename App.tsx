import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {BTab} from './src/navigator/BTab';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar />
      <NavigationContainer>
        <BTab />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
