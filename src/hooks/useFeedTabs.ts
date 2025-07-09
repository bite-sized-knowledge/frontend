import {useState, useCallback} from 'react';

type TabType = 'latest' | 'recommend';

interface UseFeedTabsProps {
  onTabChange?: (tab: TabType) => void;
  onSameTabPress?: (tab: TabType) => void;
}

export const useFeedTabs = ({ onTabChange, onSameTabPress }: UseFeedTabsProps = {}) => {
  const [selectedTab, setSelectedTab] = useState<TabType>('recommend');

  const handleTabPress = useCallback((tab: TabType) => {
    if (selectedTab === tab) {
      // 같은 탭을 다시 누르면 맨 위로 스크롤
      onSameTabPress?.(tab);
    } else {
      // 다른 탭을 누르면 탭 변경
      onTabChange?.(tab);
      setSelectedTab(tab);
    }
  }, [selectedTab, onTabChange, onSameTabPress]);

  return {
    selectedTab,
    handleTabPress,
  };
};
