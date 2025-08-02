import {useRef, useCallback} from 'react';
import {FlatList} from 'react-native';

type TabType = 'latest' | 'recommend';

interface ScrollPositions {
  latest: number;
  recommend: number;
}

export const useFeedScrollManagement = () => {
  const recentFeedListRef = useRef<FlatList>(null);
  const recommendedFeedListRef = useRef<FlatList>(null);

  // useState 대신 useRef 사용하여 리렌더링 방지
  const scrollPositionsRef = useRef<ScrollPositions>({
    latest: 0,
    recommend: 0,
  });

    const handleScroll = useCallback(
    (tab: TabType) => (offset: number) => {
      // 값이 같으면 업데이트하지 않음 (무한 루프 방지)
      if (scrollPositionsRef.current[tab] !== offset) {
        scrollPositionsRef.current = {
          ...scrollPositionsRef.current,
          [tab]: offset,
        };
      }
    },
    [],
  );

  const restoreScrollPosition = useCallback((tab: TabType) => {
    const ref = tab === 'latest' ? recentFeedListRef : recommendedFeedListRef;
    const savedPosition = scrollPositionsRef.current[tab];

    setTimeout(() => {
      ref.current?.scrollToOffset({
        offset: savedPosition,
        animated: false,
      });
    }, 100);
  }, []);

  const scrollToTop = useCallback((tab: TabType) => {
    const ref = tab === 'latest' ? recentFeedListRef : recommendedFeedListRef;
    ref.current?.scrollToOffset({animated: true, offset: 0});

    // 스크롤 위치를 0으로 업데이트
    scrollPositionsRef.current = {
      ...scrollPositionsRef.current,
      [tab]: 0,
    };
  }, []);

  return {
    recentFeedListRef,
    recommendedFeedListRef,
    handleScroll,
    restoreScrollPosition,
    scrollToTop,
  };
};
