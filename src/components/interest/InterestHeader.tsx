import React from 'react';
import {View, Text} from 'react-native';
import {typography} from '../../styles/tokens/typography';

export const InterestHeader = () => {
  return (
    <View>
      <Text style={typography.title}>
        안녕하세요!{'\n'}관심있는 주제는 무엇인가요?
      </Text>
      <Text style={typography.subHead}>*중복 선택할 수 있어요.</Text>
    </View>
  );
};