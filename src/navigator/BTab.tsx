import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';
import {FeedTab} from './FeedTab';
import Icons from '@/assets/icons';

const Tab = createBottomTabNavigator();

export const BTab = () => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HOME"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          height: 64 + insets.bottom,
          paddingTop: 20,
          borderRadius: 20,
          backgroundColor: theme.background,
        },
        tabBarIcon: ({focused}) => {
          switch (route.name) {
            case 'HOME':
              return focused ? (
                <Icons.HomeFill color={theme.text} />
              ) : (
                <Icons.HomeDefault color={theme.text} />
              );
            case 'BITE':
              return focused ? (
                <Icons.CookieBoxFill
                  color={theme.text}
                  fillSecondary={theme.background}
                />
              ) : (
                <Icons.CookieBoxDefault color={theme.text} />
              );
            case 'MY':
              return focused ? (
                <Icons.MyFill color={theme.text} />
              ) : (
                <Icons.MyDefault color={theme.text} />
              );
          }
        },
      })}>
      <Tab.Screen name="HOME" component={FeedTab} />
      <Tab.Screen name="BITE" component={() => <Text>BITE</Text>} />
      <Tab.Screen name="MY" component={() => <Text>MY</Text>} />
    </Tab.Navigator>
  );
};
