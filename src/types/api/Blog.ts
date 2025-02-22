import {Article} from '../Article';

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
export type BlogResponse = Blog;
export type BlogArticleResponse = BlogArticle;
