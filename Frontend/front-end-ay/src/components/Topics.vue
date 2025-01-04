<template>
    <div class="flex justify-center p-4">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="(topic, index) in topics"
            :key="index"
            class="middle rounded-lg w-32 h-12 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            :style="{ backgroundColor: topic.color }"
          >
            {{ topic.name }}
          </button>
        </div>
      </div>
  </template>
  
  <script>
  export default {
    props: {
      topics: {
        type: Array,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .middle {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  