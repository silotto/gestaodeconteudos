<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <router-link to="/create" class="btn-primary">
        <Plus class="w-4 h-4 inline mr-2" />
        Criar Post
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total de Posts"
        :value="stats.totalPosts"
        :icon="FileText"
        icon-class="text-blue-600"
        icon-bg-class="bg-blue-100"
      />
      
      <StatsCard
        title="Publicados"
        :value="stats.publishedPosts"
        :icon="CheckCircle"
        icon-class="text-green-600"
        icon-bg-class="bg-green-100"
      />
      
      <StatsCard
        title="Programados"
        :value="stats.scheduledPosts"
        :icon="Clock"
        icon-class="text-blue-600"
        icon-bg-class="bg-blue-100"
      />
      
      <StatsCard
        title="Rascunhos"
        :value="stats.draftPosts"
        :icon="Edit"
        icon-class="text-gray-600"
        icon-bg-class="bg-gray-100"
      />
    </div>

    <!-- Recent Posts -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-gray-900">Posts Recentes</h2>
        <router-link to="/posts" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Ver todos
        </router-link>
      </div>
      
      <div class="space-y-4">
        <div
          v-for="post in recentPosts"
          :key="post.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex-1">
            <h3 class="font-medium text-gray-900">{{ post.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ formatDate(post.createdAt) }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <span class="status-badge" :class="getStatusClass(post.status)">
              {{ post.status }}
            </span>
            <div class="flex space-x-1">
              <span
                v-for="network in post.socialNetworks.slice(0, 3)"
                :key="network"
                class="w-2 h-2 rounded-full"
                :class="getSocialColor(network)"
              ></span>
              <span v-if="post.socialNetworks.length > 3" class="text-xs text-gray-500">
                +{{ post.socialNetworks.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Activity -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Este Mês</h2>
      <div class="flex items-center space-x-2">
        <TrendingUp class="w-5 h-5 text-green-600" />
        <span class="text-2xl font-bold text-gray-900">{{ stats.thisMonthPosts }}</span>
        <span class="text-gray-600">posts criados</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Plus, FileText, CheckCircle, Clock, Edit, TrendingUp } from 'lucide-vue-next';
import { usePosts } from '@/composables/usePosts';
import StatsCard from '@/components/StatsCard.vue';
import type { PostStatus, SocialNetwork } from '@/types';

const { posts, dashboardStats } = usePosts();

const stats = computed(() => dashboardStats.value);

const recentPosts = computed(() => 
  posts.value
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
);

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const getStatusClass = (status: PostStatus): string => {
  const classes = {
    publicado: 'status-published',
    programado: 'status-scheduled',
    rascunho: 'status-draft',
  };
  return classes[status];
};

const getSocialColor = (network: SocialNetwork): string => {
  const colors = {
    instagram: 'bg-pink-500',
    facebook: 'bg-blue-600',
    twitter: 'bg-sky-500',
    linkedin: 'bg-blue-700',
    tiktok: 'bg-black',
    youtube: 'bg-red-600',
  };
  return colors[network];
};
</script>
