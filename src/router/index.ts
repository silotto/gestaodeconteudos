import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import CreatePost from '@/views/CreatePost.vue';
import PostsList from '@/views/PostsList.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsList,
  },
  {
    path: '/create',
    name: 'CreatePost',
    component: CreatePost,
  },
  {
    path: '/edit/:id',
    name: 'EditPost',
    component: CreatePost,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
