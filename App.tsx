import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {BTab} from './src/components/BTab';

function App(): React.JSX.Element {
  const backgroundStyle = {
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar />
      <NavigationContainer>
        <BTab />
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
