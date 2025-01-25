/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {TypoExample} from './src/screens/example/TypoExample';

function App(): React.JSX.Element {
  return (
    <SafeAreaView>
      <StatusBar />
      <TypoExample />
    </SafeAreaView>
  );
}

export default App;
