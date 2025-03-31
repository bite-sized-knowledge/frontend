import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/context/ThemeContext.tsx';
import {My} from '@/screens/My';
import {MyDetail} from '@/screens/My/MyDetail';
import {Withdraw} from '@/screens/My/Withdraw';
import {WithdrawDetail} from '@/screens/My/Withdraw/WithDrawDetail';

const Stack = createStackNavigator();

export const MyStack = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="My"
      screenOptions={{
        headerStyle: {
          height: 56 + insets.top,
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}>
      <Stack.Screen name="My" component={My} options={{headerShown: false}} />
      <Stack.Screen
        name="MyDetail"
        component={MyDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WithdrawDetail"
        component={WithdrawDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
