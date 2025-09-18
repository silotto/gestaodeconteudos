<template>
  <div class="card hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <span class="status-badge" :class="statusClass">
            {{ post.status }}
          </span>
          <span class="text-xs text-gray-500">
            {{ formatDate(post.createdAt) }}
          </span>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
        
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ post.content }}</p>
        
        <div class="flex flex-wrap gap-1 mb-3">
          <span
            v-for="network in post.socialNetworks"
            :key="network"
            class="social-badge"
            :class="getSocialClass(network)"
          >
            {{ getSocialLabel(network) }}
          </span>
        </div>
        
        <div class="flex flex-wrap gap-1 mb-3">
          <span
            v-for="hashtag in post.hashtags"
            :key="hashtag"
            class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
          >
            {{ hashtag }}
          </span>
        </div>
        
        <div v-if="post.scheduledDate && post.status === 'programado'" class="text-sm text-blue-600 mb-3">
          <Calendar class="w-4 h-4 inline mr-1" />
          Programado para: {{ formatDate(post.scheduledDate) }}
        </div>
      </div>
      
      <div class="flex items-center space-x-2 ml-4">
        <button
          @click="$emit('edit', post.id)"
          class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Edit2 class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', post.id)"
          class="p-2 text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div v-if="post.imageUrl" class="mt-4">
      <img
        :src="post.imageUrl"
        :alt="post.title"
        class="w-full h-48 object-cover rounded-lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Calendar, Edit2, Trash2 } from 'lucide-vue-next';
import type { Post, SocialNetwork } from '@/types';

interface Props {
  post: Post;
}

interface Emits {
  edit: [id: string];
  delete: [id: string];
}

const props = defineProps<Props>();
defineEmits<Emits>();

const statusClass = computed(() => {
  const classes = {
    publicado: 'status-published',
    programado: 'status-scheduled',
    rascunho: 'status-draft',
  };
  return classes[props.post.status];
});

const getSocialClass = (network: SocialNetwork): string => {
  const classes = {
    instagram: 'social-instagram',
    facebook: 'social-facebook',
    twitter: 'social-twitter',
    linkedin: 'social-linkedin',
    tiktok: 'social-tiktok',
    youtube: 'social-youtube',
  };
  return classes[network];
};

const getSocialLabel = (network: SocialNetwork): string => {
  const labels = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
    youtube: 'YouTube',
  };
  return labels[network];
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
</script>
