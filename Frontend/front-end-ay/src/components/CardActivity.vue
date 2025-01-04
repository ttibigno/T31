<template>
    <div class="relative h-[26rem] w-[20rem] ml-2 bg-indigo-700 rounded-xl align-middle flex flex-col p-4 mt-4 group">
        <svg
            class="absolute bottom-0 left-0 mb-6"
            viewBox="0 0 375 283"
            fill="none"
            style="transform: scale(1.5); opacity: 0.1;"
        >
            <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white" />
            <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white" />
        </svg>

        <!-- Content of the Card -->
        <div class="flex mt-auto">
            <div class="relative text-white flex flex-col items-start opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <span class="block opacity-75 text-sm mb-2">{{ activity.creator }}</span>
                <div class="flex justify-start">
                    <span class="block font-semibold text-xl">{{ activity.name }}</span>
                </div>
            </div>
        </div>

        <!-- Additional Info that will appear on hover -->
        <div class="extra-info absolute opacity-0 group-hover:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white p-4 rounded-xl transition-opacity duration-300 w-4/5 text-center">
            <h1 class="text-2xl font-semibold mb-2">{{activity.name}}</h1>
            <span class="block font-semibold">Topics: </span>
            <p class="mb-2">{{activity.topic}}</p>
            <span class="block font-semibold">Location:</span>
            <p class="mb-2 break-words">{{ activity.place }}</p>
            <span class="block font-semibold">Date:</span>
            <p class="mb-2"> {{ activity.date }}</p>
        </div>

        <div class="relative flex justify-between items-end">
            <div class="flex space-x-2 ml-auto">
                <button
                    class="text-white hover:text-indigo-700 border border-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-6 py-3 text-center"
                    @click="saveActivity"
                >
                    Save
                </button>

                <button
                    class="text-white hover:text-indigo-700 border border-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-6 py-3 text-center"
                    @click="reportActivity"
                >
                    Report
                </button>
            </div>
        </div>
    </div>
</template>
  
  <script>
  export default {
    props: {
      activity:{
        type : Object,
        required: true
      }
    },

    methods: {
        async saveActivity() {
        try {
            console.log("Activity ID:", this.activity.id);
            console.log("Auth token: ", localStorage.getItem('authToken'));

            const res = await fetch((`http://localhost:8000/api/v1/activities/join/${this.activity.id}`), {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                    'Content-Type': 'application/json'
                },
            });

            if (res.ok) {
                console.log('Activity saved successfully');
                alert('Activity joined successfully');
            } else {
                const errorData = await res.json();
                console.error('Error response from server:', errorData);
                alert(`Error: ${errorData.message || 'Failed to join activity'}`);
            }
        } catch (e) {
            console.error('Error saving activity:', e);
            alert('An unexpected error occurred while saving the activity');
        }
    },

    async reportActivity() {
        try{
            const res = await fetch(`http://localhost:8000/api/v1/activities/report/${this.activity.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.getItem('authToken'),
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                alert("Report successfully the activity");
            }
        }
        catch (e) {
            console.error('Error reporting activity:', e);
            alert('An unexpected error occurred while reporting the activity');
        }
    }
  }

}

  </script>
  
  