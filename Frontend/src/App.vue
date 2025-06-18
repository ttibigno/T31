<template>
  <div class="bg-gray-800">
    <Navbar
      v-if="$route.path !== '/'"
      :pages="pages"
      :active-page="activePage"
      :nav-link-click="setActivePage"
    />

    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      activePage: 0,
      pages: [],
    };
  },
  async created() {
    await this.fetchPages();
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
    setActivePage(index) {
      this.activePage = index;
    },
  }
};
</script>

<style>
body {
  background-color: #1f2937;
}
</style>
