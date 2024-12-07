<template>
    <navbar
        :pages="pages"
        :active-page="activePage"
        :nav-link-click="(index) => activePage = index"
    />

    <router-view/>
        <SideEvents
            :activities="activities"
        />

</template>

<script>
import Navbar from './components/Navbar.vue';
import PageViewer from './components/PageViewer.vue';
import SideEvents from './components/SideEvents.vue';

export default {
    components: {
        Navbar,
        PageViewer,
        SideEvents, 
    },
    created() {
        this.getPages();
        this.getActivities();
    },
    data() {
        return {
            activePage: 0,
            pages: [],
            activities: [],
        };
    },
    methods: {
        async getPages() {
            try {
                const res = await fetch('pages.json');
                const data = await res.json();
                this.pages = data;
            } catch (error) {
                console.error('Error fetching pages:', error);
            }
        },
        async getActivities() {
            try {
                const res = await fetch('http://localhost:8000/api/v1/activities');
                const data = await res.json();
                this.activities = data;
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        },
    },
};
</script>
