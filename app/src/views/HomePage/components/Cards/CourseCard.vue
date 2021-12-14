<template>
  <div
    class="h-60 border-2 border-gray-200 rounded-lg shadow-md px-5 py-8 hover:scale-105 duration-200 cursor-pointer"
  >
    <div class="font-bold text-2xl">{{ course_test.name }}</div>
    <div class="mt-1">{{ course_test.teachers }}</div>
    <div class="mt-1">学分: {{ course_test.credits }}</div>
    <div class="mt-1">{{ course_test.no }}</div>
    <div class="mt-1">{{ course_test.department }}</div>
    <!-- TODO: add upvote and bookmark -->
  </div>
</template>

<script lang="ts" setup>
// FIXME: contents in div too long

const course_test = {
  id: 1,
  name: '地球环境',
  teachers: '袁嘉灿',
  no: 'ATMO110002.01',
  credits: 3,
  department: '大气与海洋科学系',
};
</script>
