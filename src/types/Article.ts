export interface Article {
  id: number;
  title: string;
  description: string;
  link: string;
  thumbnail: string;
  like_count: number;
  archive_count: number;
  isLike: boolean;
  isArchived: boolean;
  isSubscribed: boolean;
  category: string[];
}
