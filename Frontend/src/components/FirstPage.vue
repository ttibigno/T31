<template>
  <div class="map-container relative flex flex-col">

    <div class="absolute top-16 left-0 w-full z-20">
      <Topics :topics="topics" @topic-filtered="updateActivities" />
    </div>


    <div class="relative flex-1">
      <!-- Mappa assoluta -->
      <div class="absolute inset-0 z-0">
        <MapComponent 
          :activities="filteredActivities" 
          :focusedActivity="focusedActivity"
          class="h-full w-full"
        />
      </div>

      <div class="absolute top-44 left-4 md:left-8 z-10 max-w-md">
        <SideEvents 
          :activities="filteredActivities" 
          @updated-activities="updateActivities"
          @focus-activity="focusedActivity = $event"
        />
      </div>
    </div>
    
  </div>
</template>





<script>
import SideEvents from './SideEvents.vue';
import Topics from './Topics.vue';
import MapComponent from './Map.vue';
import activities from '../Activities.js';

export default {
  components: {
    SideEvents,
    Topics,
    MapComponent
  },

  data() {
    return {
      activities: [],
      filteredActivities: [],
      topics: [],
      focusedActivity: null
    };

  },
  async created() {
    await this.fetchTopics();
    await this.fetchActivities();
  },
  methods: {
    async fetchTopics() {
      try {
        const res = await fetch('topics.json');
        if (res.ok) {
          this.topics = await res.json();
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      }
    },
    async fetchActivities() {
      try {
        this.activities = await activities.fetchActivities();
        this.filteredActivities = this.activities;
      } catch (err) {
        console.error('Error fetching activities:', err);
      }
    },
    updateActivities(filteredActivities) {
      this.filteredActivities = filteredActivities.length > 0
        ? filteredActivities
        : this.activities;
    }
  }
};
</script>

<style scoped>
.map-container {
  height: 100vh;
  margin-top: 0;
}

.center-button {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #2d3748;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease;
}

.center-button:hover {
  background-color: #4a5568;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.md\:flex-row {
  flex-direction: row;
}

.gap-4 {
  gap: 16px;
}

.p-4 {
  padding: 16px;
}

.w-full {
  width: 100%;
}

.md\:w-1\/2{
  width: 50%;
}

.h-full {
  height: 100%;
}

.overflow-y-auto {
  overflow-y: auto;
}

.topics-bar {
  height: 64px; /* o l'altezza effettiva dei tuoi Topics */
  background-color: #cbd5e1; /* slate-400 come nel tuo esempio */
  z-index: 10;
}
</style>
