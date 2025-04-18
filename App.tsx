import React, {useEffect} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {RootStack} from './src/navigator/RootStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ThemeProvider} from './src/context/ThemeContext';
import {Host} from 'react-native-portalize';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ToastProvider} from 'react-native-toast-notifications';
import {typography} from './src/styles/tokens/typography';
import {lightTheme} from './src/styles/themes';
import SplashScreen from 'react-native-splash-screen';
import {AuthProvider} from './src/hooks/useAuth';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 10000); //스플래시 활성화 시간
  });

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* portal로 웹뷰 drawer여는데 해당 컴포넌트에 PanGestureHandler사용됨. 따라서 부모에 GestureHandlerRootView 감싸줘야 에러발생 안함. */}
        <GestureHandlerRootView style={{flex: 1}}>
          {/* Portal 때문에 사용 */}
          <ToastProvider textStyle={typography.body} style={styles.toast}>
            <Host>
              <StatusBar />
              <QueryClientProvider client={queryClient}>
                <NavigationContainer>
                  <AuthProvider>
                    <RootStack />
                  </AuthProvider>
                </NavigationContainer>
              </QueryClientProvider>
            </Host>
          </ToastProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  toast: {
    width: '100%',
    marginHorizontal: 24,
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: lightTheme.gray2,
  },
});

export default App;
