import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import {api} from '../utils/fetchClient';
import BlogPostGridView from './BlogPostGridView';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;

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
    url: 'https://blog.example.com/react-18-features',
    publishedAt: '2024-03-15T09:00:00Z',
  },
  {
    id: '2',
    title: 'TypeScript 5.0 업데이트 정리',
    description:
      'TypeScript 5.0 버전에서 추가된 데코레이터 문법과 const Type Parameters 등 새로운 기능들을 소개합니다. 실제 코드 예제와 함께 설명드립니다.',
    author: 'antonio',
    thumbnail: 'https://picsum.photos/800/400?random=2',
    url: 'https://blog.example.com/typescript-5',
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

const BlogShortsScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBlogIndex, setBlogBlogIndex] = useState(0);
  const [posts, setPosts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGrid, setShowGrid] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // API 호출을 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      setBlogs(dummyBlogs);
    } catch (err) {
      setError('블로그 목록을 불러오는데 실패했습니다.');
      console.error(err);
    }
  };

  const fetchBlogPosts = useCallback(
    async blogId => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const filteredPosts = dummyPosts.filter(
          (post, index) => dummyBlogs[currentBlogIndex].author === post.author,
        );
        setPosts(filteredPosts);
        setCurrentIndex(0);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentBlogIndex],
  );

  useEffect(() => {
    if (blogs.length > 0) {
      fetchBlogPosts(blogs[currentBlogIndex].id);
    }
  }, [currentBlogIndex, blogs, fetchBlogPosts]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({x: gesture.dx, y: gesture.dy});
    },
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
        if (gesture.dx < 0) {
          // 왼쪽으로 스와이프
          setShowGrid(true);
        } else if (gesture.dx > 0 && currentBlogIndex > 0) {
          swipeRight();
        }
      } else if (Math.abs(gesture.dy) > SWIPE_THRESHOLD) {
        if (gesture.dy > 0 && currentIndex > 0) {
          swipeDown();
        } else if (gesture.dy < -0 && currentIndex < posts.length - 1) {
          swipeUp();
        } else {
          resetPosition();
        }
      } else {
        resetPosition();
      }
    },
  });

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: {x: -SCREEN_WIDTH, y: 0},
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setBlogBlogIndex(currentBlogIndex + 1);
      position.setValue({x: 0, y: 0});
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: {x: SCREEN_WIDTH, y: 0},
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setBlogBlogIndex(currentBlogIndex - 1);
      position.setValue({x: 0, y: 0});
    });
  };

  const swipeUp = () => {
    Animated.timing(position, {
      toValue: {x: 0, y: -SCREEN_HEIGHT},
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({x: 0, y: 0});
    });
  };

  const swipeDown = () => {
    Animated.timing(position, {
      toValue: {x: 0, y: SCREEN_HEIGHT},
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(currentIndex - 1);
      position.setValue({x: 0, y: 0});
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: {x: 0, y: 0},
      useNativeDriver: true,
    }).start();
  };

  const handleBookmark = async () => {
    const currentPost = posts[currentIndex];
    try {
      await Linking.openURL(currentPost.url);
    } catch (err) {
      console.error('링크 열기 실패:', err);
    }
  };

  const handlePostSelect = post => {
    const newIndex = posts.findIndex(p => p.id === post.id);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
    }
    setShowGrid(false);
  };

  const renderPost = (post, index) => {
    const isNext = index === currentIndex + 1;
    return (
      <Animated.View
        key={post.id}
        style={[
          styles.card,
          {
            transform: position.getTranslateTransform(),
            position: 'absolute',
            top: isNext ? SCREEN_HEIGHT : 0,
            left: 0,
            right: 0,
            bottom: isNext ? -SCREEN_HEIGHT : 0,
          },
        ]}
        {...panResponder.panHandlers}>
        {post?.thumbnail && (
          <Image source={{uri: post.thumbnail}} style={styles.thumbnail} />
        )}
        <View style={styles.header}>
          <Text style={styles.title}>{post?.title}</Text>
          <View style={styles.authorInfo}>
            <Text style={styles.author}>{post?.author}</Text>
            <Text style={styles.date}>
              {new Date(post?.publishedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text style={styles.content}>{post?.description}</Text>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBookmark}>
            <Text>🔖</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text>⤴️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.indicators}>
          <Text style={styles.blogIndicator}>
            {blogs[currentBlogIndex]?.name}
          </Text>
          <Text style={styles.pageIndicator}>
            {currentIndex + 1} / {posts.length}
          </Text>
        </View>
      </Animated.View>
    );
  };

  if (showGrid) {
    return (
      <BlogPostGridView
        posts={posts}
        onPostPress={handlePostSelect}
        onClose={() => {
          swipeLeft();
          setShowGrid(false);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!posts.length) {
    return (
      <View style={styles.centerContainer}>
        <Text>게시글이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {posts
        .slice(currentIndex, currentIndex + 2)
        .map((post, index) => renderPost(post, currentIndex + index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
    padding: 20,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    fontSize: 16,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    fontSize: 18,
    lineHeight: 24,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    padding: 10,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  blogIndicator: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 5,
    borderRadius: 10,
  },
});

export default BlogShortsScreen;
