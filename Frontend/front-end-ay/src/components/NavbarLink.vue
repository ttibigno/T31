<template>
    <a>
        <router-link
            :to="`/${index}`"
            class="nav-link" 
            :class="activeClasses" 
            aria-current="page" 
            :href="page.link.url" 
            :title="`Goes to the ${page.link.text}`" 
            >{{ page.link.text }}</router-link>  
    </a>
</template>

<script>
    export default{
        props: ['page', 'index', 'isActive'],
        computed: {
            activeClasses() {
                return{
                    active: this.isActive,
                    emphasize: this.isActive
                }
            }
        } 
    }
</script>
