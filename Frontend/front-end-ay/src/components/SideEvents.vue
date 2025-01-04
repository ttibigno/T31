<template>
    <div class="p-8 flex flex-wrap space-x-3 justify-evenly bg-zinc-100 space-y-4" v-if="showActivities">
        <!-- CardActivity component with responsive layout -->
        <CardActivity 
            v-for="(activity, index) in publishedCard" 
            :key="index" 
            :activity="activity" 
        />
    </div>
</template>

<script>
import CardActivity from './CardActivity.vue';

export default {
    props: {
        activities: {
            type: Array,
            required: true,
        },
    },
    components: {
        CardActivity,
    },
    computed: {
        showActivities() {
            return this.$route.path === '/0';
        },

        publishedCard() {
            return this.showActivities ? this.activities : [];
        },
    },
};
</script>

