/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, useColorScheme} from 'react-native';
import {TypoExample} from './src/screens/example/TypoExample';
import {InterestSelectionExample} from './src/screens/example/InterestSelectionExample';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex:1
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={backgroundStyle}>
        <InterestSelectionExample />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

export default App;
