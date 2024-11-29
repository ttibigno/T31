<template>
    <div v-if="page && Object.keys(page).length > 0" class="container mt-4 p-4">
        <h1 class="text-2xl font-bold text-gray-800">{{ page.pageTitles }}</h1>
        <p class="text-base text-gray-600">{{ page.content }}</p>
    </div>
</template>

<script>
export default{
    /*props: {
        page: {
            type: Object,
            default(rawProps){
                return{
                    pageTitle: '',
                    content: ''
                };
            }
        }
    } it's a particular form to assign a default array for page, the more straightforward technique is using v-if with length > 0*/
    props: ['page']
    
}
</script>
