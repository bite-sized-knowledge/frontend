import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/context/ThemeContext.tsx';
import {My} from '@/screens/My';
import {MyDetail} from '@/screens/My/MyDetail';
import {Withdraw} from '@/screens/My/Withdraw';
import {WithdrawDetail} from '@/screens/My/Withdraw/WithDrawDetail';
import {MY_SCREENS, MyStackParamList} from '@/types/constants/myScreens';
import {History} from '@/screens/History';
import {HistoryFeed} from '@/screens/History/HistoryFeed';

const Stack = createStackNavigator<MyStackParamList>();

export const MyStack = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={MY_SCREENS.MY_PROFILE}
      screenOptions={{
        headerStyle: {
          height: 56 + insets.top,
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}>
      <Stack.Screen
        name={MY_SCREENS.MY_PROFILE}
        component={My}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={MY_SCREENS.HISTORY}
        component={History}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={MY_SCREENS.HISTORY_FEED}
        component={HistoryFeed}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={MY_SCREENS.MY_DETAIL}
        component={MyDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={MY_SCREENS.WITHDRAW}
        component={Withdraw}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={MY_SCREENS.WITHDRAW_DETAIL}
        component={WithdrawDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
