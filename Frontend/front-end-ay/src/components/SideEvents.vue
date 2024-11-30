<template>
    <div class="p-8 flex flex-col items-left justify-left bg-zinc-100 space-y-4">
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
        publishedCard() {
            // Filtro per eventi pubblicati
            /*return this.activities.filter((a) => a.published);*/
            return this.activities;
        },
    },
};
</script>
