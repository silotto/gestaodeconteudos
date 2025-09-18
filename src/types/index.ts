export type PostStatus = 'publicado' | 'programado' | 'rascunho';

export type SocialNetwork = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';

export interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  socialNetworks: SocialNetwork[];
  scheduledDate?: Date;
  publishedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  hashtags: string[];
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  thisMonthPosts: number;
}
