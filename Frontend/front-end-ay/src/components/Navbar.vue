<template>
    <nav :class="['flex items-center justify-between py-4 px-6 bg-indigo-950'] ">
        <div class="flex items-center w-full max-w-7xl mx-auto">

            <a class="text-2xl font-bold text-zinc-100">AroundYou</a>

            <ul class="flex space-x-4 ml-auto text-zinc-100">
                <li v-for="(pages, index) in publishedPages" :key="index">
                    <navbar-link
                        :page="pages"
                        :isActive="activePage === index"
                        :index = "index"
                        @click.prevent="navLinkClick(index)"
                    ></navbar-link>
                </li>
                <a>
                    <router-link
                        :to="`/createActivity`"
                        class="nav-link" 
                        aria-current="page" 
                    >Create Activity</router-link>  
                </a>
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

    computed: {
        publishedPages() {
            return this.pages.filter((p) => p.published);
        },
    }
};
</script>
