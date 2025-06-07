import React from 'react';
import {typography} from '@/styles/tokens/typography';
import {StyleSheet, Text, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useTheme} from '@/context/ThemeContext';

interface FeedHeaderProps {
  selectedTab: 'latest' | 'recommend';
  onPressTab: (tab: 'latest' | 'recommend') => void;
}

export const FeedHeader = ({selectedTab, onPressTab}: FeedHeaderProps) => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();
  const styles = createStyles(insets, theme);

  return (
    <View style={[styles.header]}>
      <Text
        style={[
          styles.tab,
          selectedTab === 'latest' ? styles.selectedTab : styles.unselectedTab,
        ]}
        onPress={() => onPressTab('latest')}>
        최신
      </Text>
      <Text
        style={[
          styles.tab,
          selectedTab === 'recommend'
            ? styles.selectedTab
            : styles.unselectedTab,
        ]}
        onPress={() => onPressTab('recommend')}>
        추천
      </Text>
    </View>
  );
};

const createStyles = (insets: EdgeInsets, theme: Theme) =>
  StyleSheet.create({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
      paddingBottom: 16,
      paddingTop: insets.top + 16,
    },
    tab: {
      paddingHorizontal: 8,
      paddingVertical: 10,
      ...typography.subHead,
    },
    selectedTab: {
      color: theme.text,
      borderBottomWidth: 2,
      borderBottomColor: theme.text,
    },
    unselectedTab: {
      color: theme.gray3,
    },
  });
