<template>
    <div v-if = "page" class="container mt-4 p-4">
        <h1 class="text-2xl font-bold text-black-800">{{page.pageTitles}}</h1>
        <p class="text-base text-black-600">{{page.content}}</p>
    </div>
</template>

<script>
export default{
    props:['index'],
    created(){
        this.page = this.$pages.getSinglePage(this.$route.params.index);
        // this.$watch(()=> this.$route.params, (newParams, prevParams) =>{
        //     this.page = this.$pages.getSinglePage(newParamas.index);
        // });
    },
    data(){
        return {
            page: null
        };
    },

    watch:{
        index(newIndex, oldIndex){
            this.page = this.$pages.getSinglePage(newIndex);
        }
    }

}
</script>
