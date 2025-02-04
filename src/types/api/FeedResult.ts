import {ApiResponse} from './ApiResponse';

interface Blog {
  id: string;
  title: string;
  favicon: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  likeCount: number;
  archiveCount: number;
  shareCount: number;
  publishedAt: string;
  categories: string[];
  blog: Blog;
  liked: boolean;
  archived: boolean;
}

export type FeedResponse = ApiResponse<Article[]>;
