<template>
    <nav :class="['flex items-center justify-between py-4 px-6 bg-indigo-950'] ">
        <div class="flex items-center w-full max-w-7xl mx-auto">

            <a class="text-2xl font-bold text-zinc-100" href="#" >AroundYou</a>

            <ul class="flex space-x-4 ml-auto text-zinc-100">
                <li v-for="(page, index) in publishedPages" :key="index">
                    <navbar-link
                        :page="page"
                        :isActive="activePage === index"
                        @click.prevent="navLinkClick(index)"
                    ></navbar-link>
                </li>
            </ul>

            <div class="ml-4">
                <PopUpPersonal :IsShowPopup="true"></PopUpPersonal>
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

    props: ['pages', 'activePage', 'navLinkClick'],
    
    data() {
        return {
            theme: 'light', // Default theme
        };
    },

    computed: {
        publishedPages() {
            return this.pages.filter((p) => p.published);
        },
    },

    created() {
        this.getThemeSettings();
    },

    methods: {
        changeTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.storeThemeSettings();
        },

        storeThemeSettings() {
            localStorage.setItem('theme', this.theme);
        },

        getThemeSettings() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) this.theme = savedTheme;
        },
    },
};
</script>
