<template>
  <div>
    <!-- Navbar -->
    <Navbar
      :pages="pages"
      :active-page="activePage"
      :nav-link-click="(index) => activePage = index"
    />

    <div class="p-4">
      <router-view />
    </div>
    <div v-if="$route.path === '/0' ">
      <SearchBar @updated-activities="updateActivities" />
      <Topics :topics="topics" />
    </div>  
    <!-- Side Events with filtered activities -->
    <div class="w-3/5 p-4">
      <SideEvents :activities="activities" />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import SideEvents from './components/SideEvents.vue';
import SearchBar from './components/SearchBar.vue';
import Topics from './components/Topics.vue';
import activities from './Activities.js';

export default {
  components: {
    Navbar,
    SideEvents,
    SearchBar,
    Topics,
  },
  data() {
    return {
      activePage: 0,
      pages: [],
      activities: [],
      topics: [],
    };
  },
  async created() {
    this.fetchPages();
    this.fetchTopics();
    this.activities = await activities.fetchActivities();
  },
  methods: {
    async fetchPages() {
      try {
        const res = await fetch('pages.json');
        if (res.ok) {
          this.pages = await res.json();
        } else {
          console.error(`Error fetching pages: ${res.status}`);
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    },

    async fetchTopics() {
      try {
        const res = await fetch('topics.json');
        if (res.ok) {
          this.topics = await res.json();
        } else {
          console.error(`Error fetching topics: ${res.status}`);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    },

    updateActivities(filteredActivities) {
      this.activities = filteredActivities;
    },
  },
};
</script>
