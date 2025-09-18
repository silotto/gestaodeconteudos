<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Gerenciar Posts</h1>
      <router-link to="/create" class="btn-primary">
        <Plus class="w-4 h-4 inline mr-2" />
        Criar Post
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="statusFilter" class="input-field">
            <option value="">Todos</option>
            <option value="publicado">Publicados</option>
            <option value="programado">Programados</option>
            <option value="rascunho">Rascunhos</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rede Social</label>
          <select v-model="networkFilter" class="input-field">
            <option value="">Todas</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
          <div class="relative">
            <Search class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por título ou conteúdo..."
              class="input-field pl-10"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Posts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PostCard
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredPosts.length === 0" class="text-center py-12">
      <FileText class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum post encontrado</h3>
      <p class="text-gray-600 mb-4">
        {{ posts.length === 0 ? 'Comece criando seu primeiro post.' : 'Tente ajustar os filtros ou criar um novo post.' }}
      </p>
      <router-link to="/create" class="btn-primary">
        <Plus class="w-4 h-4 inline mr-2" />
        Criar Post
      </router-link>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center space-x-3 mb-4">
          <AlertTriangle class="w-6 h-6 text-red-600" />
          <h3 class="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
        </div>
        <p class="text-gray-600 mb-6">
          Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
        </p>
        <div class="flex space-x-3">
          <button @click="confirmDelete" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Excluir
          </button>
          <button @click="cancelDelete" class="flex-1 btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Search, FileText, AlertTriangle } from 'lucide-vue-next';
import { usePosts } from '@/composables/usePosts';
import PostCard from '@/components/PostCard.vue';
import type { PostStatus, SocialNetwork } from '@/types';

const router = useRouter();
const { posts, deletePost } = usePosts();

const statusFilter = ref<PostStatus | ''>('');
const networkFilter = ref<SocialNetwork | ''>('');
const searchQuery = ref('');
const showDeleteModal = ref(false);
const postToDelete = ref<string | null>(null);

const filteredPosts = computed(() => {
  let filtered = posts.value;

  if (statusFilter.value) {
    filtered = filtered.filter(post => post.status === statusFilter.value);
  }

  if (networkFilter.value) {
    filtered = filtered.filter(post => post.socialNetworks.includes(networkFilter.value as SocialNetwork));
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});

const handleEdit = (id: string) => {
  router.push(`/edit/${id}`);
};

const handleDelete = (id: string) => {
  postToDelete.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (postToDelete.value) {
    deletePost(postToDelete.value);
  }
  cancelDelete();
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  postToDelete.value = null;
};
</script>
