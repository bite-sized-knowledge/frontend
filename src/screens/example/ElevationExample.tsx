import React from 'react';
import {Card} from '../../components/card/Card';

export const ElevationExample = () => {
  const feedApiRes = [
    {
      article: {
        id: 1,
        title: '타이틀 텍스트',
        description: '서브 텍스트_한줄 요약',
        link: '',
        thumbnail: 'https://picsum.photos/800/400?random=1',
        like_count: 1,
        archive_count: 1,
        isLike: true,
        isArchived: true,
        isSubscribed: true,
        category: ['Mobile', 'Web', 'DB'],
      },
      blog: {
        id: 0,
        favicon: 'https://picsum.photos/800/400?random=2',
        title: '작성자 정보',
      },
    },
  ];

  return feedApiRes.map(res => <Card article={res.article} blog={res.blog} />);
};
