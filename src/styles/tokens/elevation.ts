import {StyleSheet, Platform} from 'react-native';

export const elevation = StyleSheet.create({
  card: {
    borderRadius: 16,
    // 플랫폼별 그림자 효과
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(85, 85, 85, 0.25)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
        shadowColor: 'rgba(85, 85, 85, 0.25)',
      },
    }),
  },
  gnb: {
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(85, 85, 85, 0.25)',
        shadowOffset: {width: 0, height: -1}, // 위쪽으로 그림자
        shadowOpacity: 1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
        shadowColor: 'rgba(85, 85, 85, 0.25)',
      },
    }),
  },
});
