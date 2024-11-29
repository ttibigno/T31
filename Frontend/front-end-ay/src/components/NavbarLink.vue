<template>
    <a 
        class="nav-link" 
        :class="activeClasses" 
        aria-current="page" 
        :href="page.link.url" 
        :title="`Goes to the ${page.link.text}`" 
    >{{ page.link.text }}
    </a>
</template>

<script>
    export default{
        props: ['page', 'isActive'],
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
