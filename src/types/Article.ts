import {Blog} from './Blog';

export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  likeCount: number;
  archiveCount: number;
  shareCount: number;
  publishedAt: string;
  keywords: string[];
  liked: boolean;
  archived: boolean;
  blog: Blog;
}
