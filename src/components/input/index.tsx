import Icons from '@/assets/icons';
import {useTheme} from '@/context/ThemeContext';
import {typography} from '@/styles/tokens/typography';
import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';

interface BaseInputProps extends TextInputProps {
  error?: string;
  msg?: string;
}

export const BaseInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  secureTextEntry = false,
  error,
  msg,
}: BaseInputProps) => {
  const {theme} = useTheme();
  const [isSecureText, setIsSecureText] = useState(false);

  return (
    <View>
      <View>
        <TextInput
          style={[
            styles.input,
            typography.body,
            {borderBottomColor: theme.gray3, color: theme.text},
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry && !isSecureText}
        />
        {secureTextEntry ? (
          isSecureText ? (
            <Icons.Eye
              width={24}
              height={24}
              onPress={() => setIsSecureText(!isSecureText)}
              style={styles.icon}
            />
          ) : (
            <Icons.Blind
              width={24}
              height={24}
              onPress={() => setIsSecureText(!isSecureText)}
              style={styles.icon}
            />
          )
        ) : null}
      </View>
      {error && (
        <Text style={[typography.label, styles.errorMsg]}>{error}</Text>
      )}
      {msg && (
        <Text style={[typography.label, {color: theme.gray1}, styles.infoMsg]}>
          {msg}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    minWidth: 320,
    height: 48,
    borderBottomWidth: 1,
  },
  icon: {
    position: 'absolute',
    right: 4,
    top: '50%',
    transform: [{translateY: -12}], // 아이콘 높이가 약 24라고 가정
  },
  infoMsg: {
    paddingTop: 4,
  },
  errorMsg: {
    paddingTop: 4,
    color: 'red',
  },
});
