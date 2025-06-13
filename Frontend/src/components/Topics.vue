<template>
<div class="flex justify-center w-full max-h-16 bg-slate-50 z-50">
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="(topic, index) in topics"
        :key="index"
        class="middle flex-col items-center w-20 h-20 font-sans shadow-transparent ml-2"
        @click="handleTopicClick(topic)"
      >
        <img :src="topic.photo" class="w-6 h-6 mb-1" />
        <span class="text-sm">{{ topic.name }}</span>
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

  data() {
    return {
      query: '',
      filteredActivities: [],
    };
  },

  methods: {
    async handleTopicClick(topic) {
      try {
        const res = await fetch(`https://backend-aroundyou.onrender.com/api/v2/activities/${topic.name}`);
        if (res.ok) {
          const result = await res.json();
          this.filteredActivities = result;
          this.$emit('topic-filtered', this.filteredActivities);
        } else {
          console.error('Error fetching activities:', res.status);
          this.$emit('topic-filtered', []);
        }
      } catch (e) {
        console.error('Error handling topic click:', e);
        this.$emit('topic-filtered', []);
      }
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
