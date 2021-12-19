<template>
  <div class="w-full h-full overflow-y-scroll">
    <NavBar />
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 max-w-screen-2xl mx-auto p-6"
    >
      <CourseCard v-for="i in 20" :key="i" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NavBar } from '@/components';
import { CourseCard } from './components';
</script>
