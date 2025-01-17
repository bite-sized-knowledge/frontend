import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';
import ShortSkeleton from '../../components/common/ShortSkeleton';
import ShortItem from './ShortItem';
import WebViewDrawer_v2 from '../../components/common/WebViewDrawer_v2';
const {height} = Dimensions.get('window');

// 더미 블로그 데이터
const dummyBlogs = [
  {
    id: '1',
    name: '테크 인사이트',
    url: 'https://blog.example.com/tech',
    author: 'siroo',
  },
  {
    id: '2',
    name: '개발자 노트',
    url: 'https://blog.example.com/dev',
    author: 'antonio',
  },
  {
    id: '3',
    name: '코딩 라이프',
    url: 'https://blog.example.com/coding',
    author: 'luizy',
  },
];
// 더미 포스트 데이터
const dummyPosts = [
  {
    id: '1',
    title: '리액트 18의 새로운 기능 살펴보기',
    description:
      '리액트 18에서 추가된 주요 기능들을 자세히 살펴봅니다. Concurrent Mode, Automatic Batching, Transitions 등 실제 프로젝트에서 어떻게 활용할 수 있는지 알아봅시다.',
    author: 'antonio',
    thumbnail: 'https://picsum.photos/800/400?random=1',
    url: 'https://www.google.com',
    publishedAt: '2024-03-15T09:00:00Z',
  },
  {
    id: '2',
    title: 'TypeScript 5.0 업데이트 정리',
    description:
      'TypeScript 5.0 버전에서 추가된 데코레이터 문법과 const Type Parameters 등 새로운 기능들을 소개합니다. 실제 코드 예제와 함께 설명드립니다.',
    author: 'antonio',
    thumbnail: 'https://picsum.photos/800/400?random=2',
    url: 'https://medium.com/daangn/graphql%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-queryfacade-%EA%B0%9C%EB%B0%9C%EA%B8%B0-d764fd300067',
    publishedAt: '2024-03-14T15:30:00Z',
  },
  {
    id: '3',
    title: '모바일 앱 성능 최적화 가이드',
    description:
      '리액트 네이티브 앱의 성능을 개선하는 10가지 방법을 소개합니다. 메모리 누수 방지부터 렌더링 최적화까지 실제 사례를 바탕으로 설명합니다.',
    author: 'luizy',
    thumbnail: 'https://picsum.photos/800/400?random=3',
    url: 'https://blog.example.com/mobile-optimization',
    publishedAt: '2024-03-13T11:20:00Z',
  },
  {
    id: '4',
    title: 'Next.js로 블로그 만들기',
    description:
      'Next.js 13을 사용하여 개인 블로그를 만드는 방법을 단계별로 알아봅니다. SSG, ISR 등 Next.js의 강력한 기능을 활용하는 방법을 배워보세요.',
    author: 'siroo',
    thumbnail: 'https://picsum.photos/800/400?random=4',
    url: 'https://blog.example.com/nextjs-blog',
    publishedAt: '2024-03-12T16:45:00Z',
  },
  {
    id: '5',
    title: '클린 코드 작성법 10가지',
    description:
      '더 나은 코드를 작성하기 위한 실용적인 팁들을 소개합니다. 네이밍, 함수 분리, 주석 작성 등 실제 프로젝트에서 바로 적용할 수 있는 방법들을 알아봅시다.',
    author: 'siroo',
    thumbnail: 'https://picsum.photos/800/400?random=5',
    url: 'https://blog.example.com/clean-code',
    publishedAt: '2024-03-11T13:15:00Z',
  },
  {
    id: '6',
    title: 'Docker 실전 가이드',
    description:
      'Docker를 사용하여 개발 환경을 구축하고 배포하는 방법을 알아봅니다. 실제 프로젝트 예제와 함께 Docker의 기본 개념부터 실전 활용법까지 설명합니다.',
    author: 'antonio',
    thumbnail: 'https://picsum.photos/800/400?random=6',
    url: 'https://blog.example.com/docker-guide',
    publishedAt: '2024-03-10T10:00:00Z',
  },
  {
    id: '7',
    title: 'GraphQL과 REST API 비교',
    description:
      'GraphQL과 REST API의 장단점을 실제 사례를 통해 비교 분석합니다. 어떤 상황에서 어떤 기술을 선택해야 할지 가이드라인을 제시합니다.',
    author: 'siroo',
    thumbnail: 'https://picsum.photos/800/400?random=7',
    url: 'https://blog.example.com/graphql-vs-rest',
    publishedAt: '2024-03-09T14:30:00Z',
  },
  {
    id: '8',
    title: 'CSS Grid 완벽 가이드',
    description:
      'CSS Grid를 사용하여 복잡한 레이아웃을 쉽게 구현하는 방법을 알아봅니다. 실제 예제를 통해 Grid의 강력한 기능들을 살펴봅시다.',
    author: 'antonio',
    thumbnail: 'https://picsum.photos/800/400?random=8',
    url: 'https://blog.example.com/css-grid',
    publishedAt: '2024-03-08T09:45:00Z',
  },
  {
    id: '9',
    title: '웹 성능 최적화 테크닉',
    description:
      '웹사이트의 성능을 개선하는 다양한 방법들을 소개합니다. 이미지 최적화, 코드 스플리팅, 캐싱 전략 등 실제 적용 가능한 기법들을 다룹니다.',
    author: 'luizy',
    thumbnail: 'https://picsum.photos/800/400?random=9',
    url: 'https://blog.example.com/web-performance',
    publishedAt: '2024-03-07T16:20:00Z',
  },
  {
    id: '10',
    title: 'GitHub Actions 활용하기',
    description:
      'GitHub Actions를 사용하여 CI/CD 파이프라인을 구축하는 방법을 설명합니다. 자동 테스트, 빌드, 배포 과정을 실제 예제와 함께 알아봅시다.',
    author: 'luizy',
    thumbnail: 'https://picsum.photos/800/400?random=10',
    url: 'https://blog.example.com/github-actions',
    publishedAt: '2024-03-06T11:10:00Z',
  },
];

const ShortList = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    // 데이터 로딩을 시뮬레이션
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // API 호출 로직
      // const response = await api.getPosts();
      // setPosts(response.data);

      // 임시로 3초 후에 더미 데이터 로드
      setTimeout(() => {
        setPosts(dummyPosts);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleShortPress = url => {
    setSelectedUrl(url);
    setIsDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedUrl(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ShortSkeleton />
      </View>
    );
  }

  const renderItem = ({item}) => (
    <ShortItem item={item} onPress={() => handleShortPress(item.url)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={false}
        pagingEnabled={true}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={height}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <WebViewDrawer_v2
        isVisible={isDrawerVisible}
        url={selectedUrl}
        onClose={handleCloseDrawer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default ShortList;
