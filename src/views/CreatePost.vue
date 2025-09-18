<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEditing ? 'Editar Post' : 'Criar Novo Post' }}
      </h1>
      <router-link to="/posts" class="btn-secondary">
        <ArrowLeft class="w-4 h-4 inline mr-2" />
        Voltar
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Info -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Título do Post *
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="input-field"
              placeholder="Digite o título do seu post..."
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo *
            </label>
            <textarea
              v-model="form.content"
              required
              rows="6"
              class="textarea-field"
              placeholder="Escreva o conteúdo do seu post..."
            ></textarea>
            <div class="text-sm text-gray-500 mt-1">
              {{ form.content.length }}/2000 caracteres
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem (opcional)
            </label>
            <input
              v-model="form.imageUrl"
              type="url"
              class="input-field"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
        </div>
      </div>

      <!-- Social Networks -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Redes Sociais *</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label
            v-for="network in availableNetworks"
            :key="network.value"
            class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{ 'border-blue-500 bg-blue-50': form.socialNetworks.includes(network.value) }"
          >
            <input
              v-model="form.socialNetworks"
              type="checkbox"
              :value="network.value"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <component :is="network.icon" class="w-5 h-5" :class="network.color" />
            <span class="font-medium text-gray-900">{{ network.label }}</span>
          </label>
        </div>
      </div>

      <!-- Hashtags -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Hashtags</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Adicionar Hashtags
            </label>
            <div class="flex space-x-2">
              <input
                v-model="newHashtag"
                type="text"
                class="input-field"
                placeholder="#marketing"
                @keyup.enter="addHashtag"
              />
              <button
                type="button"
                @click="addHashtag"
                class="btn-secondary"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div v-if="form.hashtags.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="(hashtag, index) in form.hashtags"
              :key="index"
              class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {{ hashtag }}
              <button
                type="button"
                @click="removeHashtag(index)"
                class="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
        </div>
      </div>

      <!-- Publishing Options -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Opções de Publicação</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="form.status" class="input-field">
              <option value="rascunho">Salvar como Rascunho</option>
              <option value="publicado">Publicar Agora</option>
              <option value="programado">Programar Publicação</option>
            </select>
          </div>
          
          <div v-if="form.status === 'programado'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Data e Hora da Publicação
            </label>
            <input
              v-model="scheduledDateTime"
              type="datetime-local"
              class="input-field"
              :min="minDateTime"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4">
        <router-link to="/posts" class="btn-secondary">
          Cancelar
        </router-link>
        <button
          type="submit"
          class="btn-primary"
          :disabled="!isFormValid"
        >
          <Save class="w-4 h-4 inline mr-2" />
          {{ isEditing ? 'Salvar Alterações' : getSubmitButtonText() }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, Plus, X, Save, Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-vue-next';
import { usePosts } from '@/composables/usePosts';
import type { PostStatus, SocialNetwork } from '@/types';

const router = useRouter();
const route = useRoute();
const { posts, addPost, updatePost } = usePosts();

const isEditing = computed(() => Boolean(route.params.id));
const editingPost = ref(isEditing.value ? posts.value.find(p => p.id === route.params.id) : null);

const form = ref({
  title: '',
  content: '',
  imageUrl: '',
  socialNetworks: [] as SocialNetwork[],
  hashtags: [] as string[],
  status: 'rascunho' as PostStatus,
});

const newHashtag = ref('');
const scheduledDateTime = ref('');

const availableNetworks = [
  { value: 'instagram' as SocialNetwork, label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { value: 'facebook' as SocialNetwork, label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { value: 'twitter' as SocialNetwork, label: 'Twitter', icon: Twitter, color: 'text-sky-500' },
  { value: 'linkedin' as SocialNetwork, label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { value: 'youtube' as SocialNetwork, label: 'YouTube', icon: Youtube, color: 'text-red-600' },
];

const minDateTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  return now.toISOString().slice(0, 16);
});

const isFormValid = computed(() => {
  return form.value.title.trim() && 
         form.value.content.trim() && 
         form.value.socialNetworks.length > 0 &&
         (form.value.status !== 'programado' || scheduledDateTime.value);
});

const addHashtag = () => {
  if (!newHashtag.value.trim()) return;
  
  let hashtag = newHashtag.value.trim();
  if (!hashtag.startsWith('#')) {
    hashtag = '#' + hashtag;
  }
  
  if (!form.value.hashtags.includes(hashtag)) {
    form.value.hashtags.push(hashtag);
  }
  
  newHashtag.value = '';
};

const removeHashtag = (index: number) => {
  form.value.hashtags.splice(index, 1);
};

const getSubmitButtonText = () => {
  switch (form.value.status) {
    case 'publicado':
      return 'Publicar Agora';
    case 'programado':
      return 'Programar';
    default:
      return 'Salvar Rascunho';
  }
};

const handleSubmit = () => {
  if (!isFormValid.value) return;

  const postData = {
    title: form.value.title.trim(),
    content: form.value.content.trim(),
    imageUrl: form.value.imageUrl.trim() || undefined,
    socialNetworks: form.value.socialNetworks,
    hashtags: form.value.hashtags,
    status: form.value.status,
    scheduledDate: form.value.status === 'programado' ? new Date(scheduledDateTime.value) : undefined,
    publishedDate: form.value.status === 'publicado' ? new Date() : undefined,
  };

  if (isEditing.value && editingPost.value) {
    updatePost(editingPost.value.id, postData);
  } else {
    addPost(postData);
  }

  router.push('/posts');
};

onMounted(() => {
  if (isEditing.value && editingPost.value) {
    form.value = {
      title: editingPost.value.title,
      content: editingPost.value.content,
      imageUrl: editingPost.value.imageUrl || '',
      socialNetworks: [...editingPost.value.socialNetworks],
      hashtags: [...editingPost.value.hashtags],
      status: editingPost.value.status,
    };
    
    if (editingPost.value.scheduledDate) {
      scheduledDateTime.value = new Date(editingPost.value.scheduledDate.getTime() - editingPost.value.scheduledDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }
  }
});
</script>
