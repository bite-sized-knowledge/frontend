import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icons from '@/assets/icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  style,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          marginTop: insets.top,
          backgroundColor: theme.background,
        },
        style,
      ]}>
      {showBackButton && (
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <Icons.ArrowLeft color={theme.text} />
        </Pressable>
      )}
      <Text style={[styles.title, typography.subHead, {color: theme.text}]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  title: {
    textAlign: 'center',
  },
});

export default CustomHeader;
