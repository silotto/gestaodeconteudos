import { ref, computed } from 'vue';
import type { Post, PostStatus, SocialNetwork, DashboardStats } from '@/types';
import { faker } from '@faker-js/faker';

const posts = ref<Post[]>([]);

// Generate initial mock data
const generateMockPosts = (): Post[] => {
  const mockPosts: Post[] = [];
  const statuses: PostStatus[] = ['publicado', 'programado', 'rascunho'];
  const networks: SocialNetwork[] = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube'];
  
  for (let i = 0; i < 15; i++) {
    const status = faker.helpers.arrayElement(statuses);
    const createdAt = faker.date.recent({ days: 30 });
    
    mockPosts.push({
      id: faker.string.uuid(),
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      content: faker.lorem.paragraphs({ min: 1, max: 3 }),
      status,
      socialNetworks: faker.helpers.arrayElements(networks, { min: 1, max: 3 }),
      scheduledDate: status === 'programado' ? faker.date.future() : undefined,
      publishedDate: status === 'publicado' ? createdAt : undefined,
      createdAt,
      updatedAt: createdAt,
      imageUrl: Math.random() > 0.5 ? `https://picsum.photos/400/300?random=${i}` : undefined,
      hashtags: faker.helpers.arrayElements([
        '#marketing', '#socialmedia', '#content', '#digital', '#business',
        '#growth', '#engagement', '#brand', '#strategy', '#viral'
      ], { min: 2, max: 5 })
    });
  }
  
  return mockPosts;
};

// Initialize with mock data if localStorage is empty
const initializePosts = () => {
  const stored = localStorage.getItem('socialmanager-posts');
  if (stored) {
    posts.value = JSON.parse(stored).map((post: any) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      scheduledDate: post.scheduledDate ? new Date(post.scheduledDate) : undefined,
      publishedDate: post.publishedDate ? new Date(post.publishedDate) : undefined,
    }));
  } else {
    posts.value = generateMockPosts();
    savePosts();
  }
};

const savePosts = () => {
  localStorage.setItem('socialmanager-posts', JSON.stringify(posts.value));
};

export const usePosts = () => {
  // Initialize posts on first use
  if (posts.value.length === 0) {
    initializePosts();
  }

  const dashboardStats = computed<DashboardStats>(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      totalPosts: posts.value.length,
      publishedPosts: posts.value.filter(p => p.status === 'publicado').length,
      scheduledPosts: posts.value.filter(p => p.status === 'programado').length,
      draftPosts: posts.value.filter(p => p.status === 'rascunho').length,
      thisMonthPosts: posts.value.filter(p => p.createdAt >= startOfMonth).length,
    };
  });

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: Post = {
      ...postData,
      id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    posts.value.unshift(newPost);
    savePosts();
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    const index = posts.value.findIndex(p => p.id === id);
    if (index !== -1) {
      posts.value[index] = {
        ...posts.value[index],
        ...updates,
        updatedAt: new Date(),
      };
      savePosts();
    }
  };

  const deletePost = (id: string) => {
    const index = posts.value.findIndex(p => p.id === id);
    if (index !== -1) {
      posts.value.splice(index, 1);
      savePosts();
    }
  };

  const getPostsByStatus = (status: PostStatus) => {
    return computed(() => posts.value.filter(p => p.status === status));
  };

  const getPostsBySocialNetwork = (network: SocialNetwork) => {
    return computed(() => posts.value.filter(p => p.socialNetworks.includes(network)));
  };

  return {
    posts: computed(() => posts.value),
    dashboardStats,
    addPost,
    updatePost,
    deletePost,
    getPostsByStatus,
    getPostsBySocialNetwork,
  };
};
