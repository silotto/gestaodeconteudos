<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div class="hidden lg:block w-64 fixed h-full">
      <Sidebar />
    </div>

    <!-- Mobile menu button -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="bg-white p-2 rounded-lg shadow-md border border-gray-200"
      >
        <Menu class="w-5 h-5 text-gray-600" />
      </button>
    </div>

    <!-- Mobile sidebar -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 z-40 flex"
    >
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="mobileMenuOpen = false"></div>
      <div class="relative w-64 bg-white shadow-xl">
        <Sidebar />
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 lg:ml-64">
      <main class="p-4 lg:p-8 pt-16 lg:pt-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Menu } from 'lucide-vue-next';
import Sidebar from '@/components/Sidebar.vue';

const mobileMenuOpen = ref(false);
</script>
