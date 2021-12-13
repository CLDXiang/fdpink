<template>
  <div class="flex justify-between items-center">
    <div class="sticky top-0 w-full h-12 flex justify-center items-center">
      <SearchInput class="w-5/6 sm:max-w-2xl" />
    </div>
    <div id="nav-buttons" class="flex w-40 justify-around">
      <div>{{ $t('courses') }}</div>
      <div>{{ $t('feedbacks') }}</div>
      <div>{{ $t('login') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SearchInput } from './components';
</script>
