import {useRef, useState, useCallback} from 'react';
import {FlatList} from 'react-native';

type TabType = 'latest' | 'recommend';

interface ScrollPositions {
  latest: number;
  recommend: number;
}

export const useFeedScrollManagement = () => {
  const recentFeedListRef = useRef<FlatList>(null);
  const recommendedFeedListRef = useRef<FlatList>(null);

  const [scrollPositions, setScrollPositions] = useState<ScrollPositions>({
    latest: 0,
    recommend: 0,
  });

  const handleScroll = useCallback((tab: TabType) => (offset: number) => {
    setScrollPositions(prev => ({
      ...prev,
      [tab]: offset,
    }));
  }, []);

  const restoreScrollPosition = useCallback((tab: TabType) => {
    const ref = tab === 'latest' ? recentFeedListRef : recommendedFeedListRef;
    const savedPosition = scrollPositions[tab];

    setTimeout(() => {
      ref.current?.scrollToOffset({
        offset: savedPosition,
        animated: false,
      });
    }, 100);
  }, [scrollPositions]);

  const scrollToTop = useCallback((tab: TabType) => {
    const ref = tab === 'latest' ? recentFeedListRef : recommendedFeedListRef;
    ref.current?.scrollToOffset({animated: true, offset: 0});

    // 스크롤 위치를 0으로 업데이트
    setScrollPositions(prev => ({
      ...prev,
      [tab]: 0,
    }));
  }, []);

  return {
    recentFeedListRef,
    recommendedFeedListRef,
    handleScroll,
    restoreScrollPosition,
    scrollToTop,
  };
};
