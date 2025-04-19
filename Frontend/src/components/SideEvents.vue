<template>
  <div class="w-[90vw] md:w-[460px] bg-white rounded-2xl p-4 pt-6">
    <p class="font-semibold text-2xl text-center mb-3">Attività</p>
    <SearchBar class="mb-3" @updated-activities="handleUpdatedActivities" />
    <div class="overflow-y-auto p-4 bg-white rounded-lg h-[55vh] w-full custom-scroll pb-6">
      <div class="grid grid-cols-1 gap-2">
        <CardActivity
          v-for="(activity, index) in activities"
          :key="index"
          :activity="activity"
          @focus-activity="handleFocusActivity"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CardActivity from './CardActivity.vue';
import SearchBar from './SearchBar.vue';

export default {
  props: {
    activities: {
      type: Array,
      required: true,
    },
  },
  components: {
    CardActivity,
    SearchBar
  },
  methods: {
    handleUpdatedActivities(filteredActivities) {
      this.$emit('updated-activities', filteredActivities);
    },
    handleFocusActivity(activity) {
      this.$emit('focus-activity', activity);
    }
  }
};
</script>

<style scoped>
/* Nascondi scrollbar (Chrome, Safari) */
.custom-scroll::-webkit-scrollbar {
  display: none;
}

/* Nascondi scrollbar (Firefox) */
.custom-scroll {
  scrollbar-width: none;
}

.w-[90vw] {
  max-width: 90vw;
  box-sizing: border-box;
}

.md\:w-[460px] {
  max-width: 460px;
  box-sizing: border-box;
}

.p-4 {
  padding: 1rem; /* Assicurati che la spaziatura sia corretta */
}

.pt-6 {
  padding-top: 1.5rem;
}

.pb-6 {
  padding-bottom: 1.5rem;
}

.font-semibold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.m-0 {
  margin: 0;
}

.mb-3 {
  margin-bottom: 1rem;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: 1fr;
}

.gap-2 {
  gap: 0.5rem;
}
</style>