import React from 'react';
import {View, Text} from 'react-native';
import {typography} from '../../styles/typography';

export const TypoExample = () => {
  return (
    <View>
      <Text style={typography.title}>
        안녕하세요!{'\n'}관심있는 주제는 무엇인가요?
      </Text>
      <Text style={typography.head}>
        토스 피플: 문과생에서 토스 개발 리더까지
      </Text>
      <Text style={typography.subHead}>Hardware & IoT</Text>
      <Text style={typography.body}>
        UX Engineering Team Leader 조유성님의 인터뷰
      </Text>
      <Text style={typography.label}>#Mobile</Text>
      <Text style={typography.caption}>
        계정 탈퇴 시 개인 정보를 비롯한 이용 중인 모든 기록이 삭제됩니다.
      </Text>
    </View>
  );
};
