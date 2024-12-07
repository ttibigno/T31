<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
    <form 
      class="bg-white p-10 rounded-lg shadow-lg w-96"
      @submit.prevent="handleActivity"
    >

      <h1 class="text-2xl font-bold mb-6 text-gray-700 text-center">Create Activity</h1>

      <div class="mb-4">
        <label for="title" class="block text-gray-600 font-medium">Activity Title</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          placeholder="Enter the Activity title"
          class="w-full border rounded-lg px-4 py-2 mt-2"
          required 
        />
      </div>

      <!-- <div class="mb-4">
        <label for="description" class="block text-gray-600 font-medium">Activity Description</label>
        <textarea 
          id="description" 
          v-model="description" 
          rows="3" 
          placeholder="Provide details about the Activity"
          class="w-full border rounded-lg px-4 py-2 mt-2"
          required
        ></textarea>
      </div> -->

      <div class="mb-4">
        <label for="place" class="block text-gray-600 font-medium">place</label>
        <input 
          id="place" 
          v-model="place" 
          placeholder="Add the Google Maps link"
          class="w-full border rounded-lg px-4 py-2 mt-2"
        />
      </div>

      <div class="mb-4">
        <label for="topic" class="block text-gray-600 font-medium">Topics</label>
          <input 
            type="text" 
            id="topic" 
            v-model="topic" 
            placeholder="Add a topic"
            class="w-full border rounded-lg px-4 py-2"
          />
      </div>

      <div class="mb-4">
        <label for="maxSlot" class="block text-gray-600 font-medium">Max number participants</label>
        <input 
          type="number" 
          id="maxSlot" 
          v-model="maxSlot" 
          placeholder="Max slot"
          class="w-full border rounded-lg px-4 py-2 mt-2"
        />
      </div>

      <div class="mb-4">
        <label for="date" class="block text-gray-600 font-medium">Date of the event</label>
        <input 
          type="date" 
          id="date" 
          v-model="date" 
          placeholder="Date of the activity"
          class="w-full border rounded-lg px-4 py-2 mt-2"
        />
      </div>

      <!--<div class="mb-4">
        <label for="reaminingSlot" class="block text-gray-600 font-medium">Remaining slot</label>
        <input 
          type="text" 
          id="remainingSlot" 
          v-model="remainingSlot" 
          placeholder="Remaining slot for participating"
          class="w-full border rounded-lg px-4 py-2 mt-2"
        />
      </div>

      <div class="mb-4">
        <label for="contacts" class="block text-gray-600 font-medium">Contacts</label>
        <input 
          type="text" 
          id="contacts" 
          v-model="contacts" 
          placeholder="Put your contacts"
          class="w-full border rounded-lg px-4 py-2 mt-2"
        />
      </div>


      <div class="mb-4">
        <label for="instagram" class="block text-gray-600 font-medium">Instagram Username</label>
        <input 
          type="text" 
          id="instagram" 
          v-model="instagram" 
          placeholder="Your Instagram username"
          class="w-full border rounded-lg px-4 py-2 mt-2"
        />
      </div>

      <div class="mb-4">
        <label for="discord" class="block text-gray-600 font-medium">Discord Username</label>
        <input 
          type="text" 
          id="discord" 
          v-model="discord" 
          placeholder="Your Discord username"
          class="w-full border rounded-lg px-4 py-2 mt-2"
        />
      </div>-->

      <button 
        type="submit" 
        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
      >
        Create Activity
      </button>
    </form>
  </div>
</template>

<script>
import { CreateActivity } from '@/authService.js';

export default {
  
  data() {
    return {
      name: '',
      topic: '',
      place: '',
      date: '',
      maxSlot:0,
    }
  },

  methods: {
    async handleActivity(){
        const result = await CreateActivity(this.name, this.topic, this.place, this.date, this.maxSlot);

        if(result.success){
          alert('Activity created successfully!');
          this.$router.push('/0');
        }
        else{
          alert('Failed to create activity');
        }
    }
  }
};
</script>
