<template>
  <div class="flex justify-center p-4">
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="(topic, index) in topics"
        :key="index"
        class="middle rounded-lg w-28 h-12 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        :style="{ backgroundColor: topic.color }"
        @click="handleTopicClick(topic)"
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

  data() {
    return {
      query: '',
      filteredActivities: [],
    };
  },

  methods: {
    async handleTopicClick(topic) {
      try {
        const res = await fetch(`http://localhost:8000/api/v2/activities/${topic.name}`);
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
