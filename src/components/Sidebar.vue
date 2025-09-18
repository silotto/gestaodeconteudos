<template>
  <div class="bg-white shadow-sm border-r border-gray-200 h-full">
    <div class="p-6">
      <div class="flex items-center space-x-3">
        <div class="bg-blue-600 p-2 rounded-lg">
          <BarChart3 class="w-6 h-6 text-white" />
        </div>
        <h1 class="text-xl font-bold text-gray-900">SocialManager</h1>
      </div>
    </div>

    <nav class="px-6 pb-6">
      <ul class="space-y-1">
        <li>
          <router-link
            to="/"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200"
            :class="$route.name === 'Dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'"
          >
            <BarChart3 class="w-5 h-5" />
            <span class="font-medium">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/posts"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200"
            :class="$route.name === 'Posts' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'"
          >
            <FileText class="w-5 h-5" />
            <span class="font-medium">Posts</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/create"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200"
            :class="$route.name === 'CreatePost' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Plus class="w-5 h-5" />
            <span class="font-medium">Criar Post</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="px-6 py-4 border-t border-gray-200 mt-auto">
      <div class="text-xs text-gray-500">
        © 2025 SocialManager
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3, FileText, Plus } from 'lucide-vue-next';
</script>
