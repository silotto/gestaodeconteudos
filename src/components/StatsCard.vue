<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ value }}</p>
        <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div class="p-3 rounded-lg" :class="iconBgClass">
        <component :is="icon" class="w-6 h-6" :class="iconClass" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: Component;
  iconClass?: string;
  iconBgClass?: string;
}

withDefaults(defineProps<Props>(), {
  iconClass: 'text-blue-600',
  iconBgClass: 'bg-blue-100',
});
</script>
