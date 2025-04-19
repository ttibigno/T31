<template>
    <nav :class="['fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between py-4 px-6 bg-black']">
        <div class="flex items-center w-full max-w-7xl mx-32">
            <a class="text-2xl font-bold text-zinc-100">AroundYou</a>

            <ul class="flex space-x-4 ml-auto text-zinc-100">
                <li v-for="(page, index) in publishedPages" :key="index">
                    <navbar-link
                        :page="page"
                        :isActive="activePage === index"
                        :index="index"
                        @click="handleNavLinkClick(index)"
                    ></navbar-link>
                </li>
                <li>
                    <router-link
                        to="/createActivity"
                        class="nav-link"
                        aria-current="page"
                    >Create Activity</router-link>
                </li>
            </ul>

            <div class="ml-4">
                <PopUpPersonal :isShowPopup="true" />
            </div>
        </div>
    </nav>
</template>

<script>
import PopUpPersonal from './PopUpPersonalArea.vue';
import NavbarLink from './NavbarLink.vue';

export default {
    components: {
        NavbarLink,
        PopUpPersonal,
    },

    props: {
        pages: {
            type: Array,
            required: true,
        },
        activePage: {
            type: Number,
            required: true,
        },
        navLinkClick: {
            type: Function,
            required: true,
        },
    },

    computed: {
        publishedPages() {
            return this.pages.filter((page) => page.published);
        },
    },

    methods: {
        handleNavLinkClick(index) {
            this.navLinkClick(index);
        },
    },
};
</script>

<style scoped>
.nav-link {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: background-color 0.3s ease;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link[aria-current="page"] {
    background-color: rgba(255, 255, 255, 0.2);
}
</style>