import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {BStack} from './src/navigator/BStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ThemeProvider} from './src/context/ThemeContext';
import {Host} from 'react-native-portalize';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* portal로 웹뷰 drawer여는데 해당 컴포넌트에 PanGestureHandler사용됨. 따라서 부모에 GestureHandlerRootView 감싸줘야 에러발생 안함. */}
        <GestureHandlerRootView style={{flex: 1}}>
          {/* Portal 때문에 사용 */}
          <Host>
            <StatusBar />
            <QueryClientProvider client={queryClient}>
              <NavigationContainer>
                <BStack />
              </NavigationContainer>
            </QueryClientProvider>
          </Host>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
