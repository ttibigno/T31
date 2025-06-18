<template>
  <div class="w-full bg-white">
    <div class="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-gray-700 overflow-hidden">
      <div class="grid place-items-center h-full w-12 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        class="search-input peer h-full w-full outline-none text-sm pr-2"
        @input="querieddActivities"
        v-model="query"
        type="text"
        placeholder="Cerca una attività..." /> 
    </div>
  </div>
</template>


<script>
export default {
    data() {
        return {
            query: '',
            filteredActivities: []
        }
    },

    methods: {
        async querieddActivities(){
            try{
                const res = await fetch(`https://backend-aroundyou.onrender.com/api/v2/activities/${this.query}`);
                if(res.ok){
                    const result = await res.json();
                    this.filteredActivities = result;
                    this.$emit('updated-activities', this.filteredActivities);
                }
                else{
                    console.error(`Error fetching activities: ${res.status}`);
                    this.filteredActivities = [];
                    this.$emit('updated-activities', []);
                }
            }catch(error) {
                this.$emit('updated-activities', []);
            }
        }
    }
}
</script>

<style scoped>
    .search-input{
        outline: none;
        border-color: transparent;
        box-shadow: none;
    }
    .search-input:focus{
        outline: none;
        border: none;
    }

</style>