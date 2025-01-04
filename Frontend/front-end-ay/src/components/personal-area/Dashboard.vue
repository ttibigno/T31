<template> 
    <router-view></router-view>
    <div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-2xl px-7 py-2">
      <div class="flex">
        <div class="flex-auto group">
        <router-link to="/dashboard" class="flex items-center justify-center text-center mx-auto px-4 py-2 group-hover:w-full text-indigo-500">
            <span class=" flex items-center px-4 py-2 group-hover:bg-indigo-100 rounded-full">
              <i class="far fa-home text-2xl"></i>
              <span class="hidden group-hover:inline-block ml-3">Home</span>
            </span>
        </router-link>
        </div>
        
        <div class="flex-auto group">
            <router-link to="/dashboard/OwnActivities" class="flex items-center justify-center text-center mx-auto px-4 py-2 group-hover:w-full text-indigo-500">
                <span class=" flex items-center px-4 py-2 group-hover:bg-indigo-100 rounded-full">
              <i class="far fa-chart-bar text-2xl"></i>
              <span class="hidden group-hover:inline-block ml-3">Results</span>
            </span>
            </router-link>
        </div>
        
        <div class="flex-auto group">
            <router-link to="/dashboard/Saved" class="flex items-center justify-center text-center mx-auto px-4 py-2 group-hover:w-full text-indigo-500">
                <span class=" flex items-center px-4 py-2 group-hover:bg-indigo-100 rounded-full">
              <i class="far fa-heart text-2xl"></i>
              <span class="hidden group-hover:inline-block ml-3">Saved</span>
            </span>
            </router-link>
        </div>
        
        <div class="flex-auto group">
            <router-link to="/dashboard/Settings" class="flex items-center justify-center text-center mx-auto px-4 py-2 group-hover:w-full text-indigo-500">
                <span class=" flex items-center px-4 py-2 group-hover:bg-indigo-100 rounded-full">
              <i class="far fa-cog text-2xl"></i>
              <span class="hidden group-hover:inline-block ml-3">Settings</span>
            </span>
            </router-link>
        </div>
      </div>
    </div>
  </template>

<script>
  export default {
  }

</script>
  
  <style scoped>
  @import url(https://pro.fontawesome.com/releases/v5.10.0/css/all.css);
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;800&display=swap');
  body {
    font-family: 'Poppins', sans-serif;
  }
  .group:hover .group-hover\:inline-block {
    display: inline-block;
  }
  </style>
  