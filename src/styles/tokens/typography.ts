import {StyleSheet} from 'react-native';

const FONT_FAMILY = 'pretendard';

export const typography = StyleSheet.create({
  title: {
    marginTop: 20,
    marginStart: 20,
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.0552,
    lineHeight: 32,
  },
  head: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.24,
    lineHeight: 28,
  },
  subHead: {
    marginStart: 20,
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.16,
    lineHeight: 24,
  },
  body: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.16,
    lineHeight: 24,
  },
  label: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.14,
    lineHeight: 22,
  },
  caption: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.12,
    lineHeight: 16,
  },
});
