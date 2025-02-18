// SkeletonCard.tsx
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {elevation} from '../../styles/tokens/elevation';
import {useTheme} from '../../context/ThemeContext';
import {Shimmer} from '../common/Shimmer';

export const SkeletonCard: React.FC = () => {
  const {theme, themeMode} = useTheme();
  const skeletonColor = theme.background;

  return (
    <View
      style={[
        styles.card,
        elevation.card,
        {
          backgroundColor:
            themeMode === 'light' ? theme.background : theme.gray4,
        },
      ]}>
      {/* 카드 헤더 스켈레톤 */}
      <View style={styles.cardHeaderContainer}>
        <View style={styles.profileContainer}>
          <Shimmer
            style={[styles.faviconSkeleton, {backgroundColor: skeletonColor}]}
          />
          <Shimmer
            style={[
              styles.headerTextSkeleton,
              {backgroundColor: skeletonColor},
            ]}
          />
        </View>
      </View>

      {/* 썸네일 스켈레톤 */}
      <Shimmer
        style={[styles.thumbnailSkeleton, {backgroundColor: skeletonColor}]}
      />

      {/* 카드 콘텐츠 스켈레톤 */}
      <View style={styles.cardContent}>
        <Shimmer
          style={[styles.titleSkeleton, {backgroundColor: skeletonColor}]}
        />
        <Shimmer
          style={[styles.bodySkeleton, {backgroundColor: skeletonColor}]}
        />
        <View style={styles.categoryContainer}>
          <Shimmer
            style={[styles.categorySkeleton, {backgroundColor: skeletonColor}]}
          />
          <Shimmer
            style={[styles.categorySkeleton, {backgroundColor: skeletonColor}]}
          />
          <Shimmer
            style={[styles.categorySkeleton, {backgroundColor: skeletonColor}]}
          />
        </View>
      </View>

      {/* 하단 반응 버튼 스켈레톤 */}
      <View style={styles.bottomContainer}>
        <View style={styles.leftSection}>
          <Shimmer
            style={[styles.reactionSkeleton, {backgroundColor: skeletonColor}]}
          />
          <Shimmer
            style={[styles.reactionSkeleton, {backgroundColor: skeletonColor}]}
          />
        </View>
        <View style={styles.rightSection}>
          <Shimmer
            style={[styles.reactionSkeleton, {backgroundColor: skeletonColor}]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    minWidth: 320,
    minHeight: 396,
    borderRadius: 16,
  },
  cardHeaderContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  faviconSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  headerTextSkeleton: {
    height: 16,
    width: 100,
    borderRadius: 4,
  },
  thumbnailSkeleton: {
    minWidth: 320,
    minHeight: 160,
  },
  cardContent: {
    minWidth: 320,
    minHeight: 128,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  titleSkeleton: {
    height: 20,
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  bodySkeleton: {
    height: 14,
    width: '90%',
    borderRadius: 4,
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  categorySkeleton: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 4,
    marginBottom: 4,
  },
  bottomContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexGrow: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  reactionSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
