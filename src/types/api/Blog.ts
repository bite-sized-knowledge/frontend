import {Article} from '../Article';
import {ApiResponse} from './ApiResponse';

interface Blog {
  id: string;
  title: string;
  url: string;
  favicon: string;
  isSubscribed: boolean;
}

interface BlogArticle {
  articles: Omit<Article, 'blog'>[];
  next: string;
}
export type BlogResponse = ApiResponse<Blog>;
export type BlogArticleResponse = ApiResponse<BlogArticle>;
