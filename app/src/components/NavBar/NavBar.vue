<script lang="ts" setup>
import { SearchInput } from './components'
</script>

<template>
  <div class="sticky top-0 w-full h-12 flex justify-between items-center mt-4">
    <div>
      <ul class="flex ml-8">
        <!-- TODO: logo for fdpink here -->
        <li class="mr-7 cursor-pointer hover:underline">课程</li>
        <li class="mr-7 cursor-pointer hover:underline">评课</li>
        <li class="mr-7 cursor-pointer hover:underline">关于</li>
      </ul>
    </div>
    <SearchInput class="w-30 md:w-1/6 sm:max-w-2xl" />
  </div>
</template>
