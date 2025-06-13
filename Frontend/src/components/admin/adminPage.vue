<template>
  <div class="container pt-20 p-6 max-w-full mx-auto flex space-x-6 bg-gray-850 ">
  <div class="w-2/3 bg-white p-4 border border-gray-200 rounded shadow-md">
      <h2 class="text-2xl font-bold mb-4">Attività Segnalate</h2>
      
      <!-- Lista delle attività -->
      <div v-if="activitiesReported.length">
        <ul class="space-y-4">
          <li v-for="(activity, index) in activitiesReported" :key="index" class="p-4 border-b flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-xl">{{ activity.name }}</h3>
              <p>{{ activity.date }}</p>
              <p>{{ activity.creator }}</p>
            </div>
            <button 
              @click="deleteActivity(activity._id)" 
              class="bg-red-600 text-white px-3 py-1 font-semibold rounded hover:bg-red-700"
            >
              Elimina
            </button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Nessuna attività segnalata.</p>
      </div>
    </div>
    <!-- Div a sinistra con la lista utenti -->
    <div class="w-1/3 bg-white p-4 border border-gray-200 rounded shadow-md">
      <input
        v-model="searchQuery"
        @input="filterUsers"
        type="text"
        placeholder="Cerca utente..."
        class="w-full p-2 mb-4 border border-gray-300 rounded"
      />
    
      <div class="overflow-y-auto h-96 border border-gray-200 rounded shadow-md">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="text-left p-3">Nome Utente</th>
              <th class="p-3">Azione</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index" class="border-b">
              <td class="p-3">{{ user.name }}</td>
              <td class="p-3 text-center">
                <button
                  @click="promoteUser(user._id)"
                  class="bg-indigo-600 text-white px-4 py-1 font-semibold rounded hover:bg-indigo-700 mr-2"
                >
                  Promuovi
                </button>
                <button
                  @click="deleteUser(user._id)"
                  class="bg-red-600 text-white px-4 py-1 font-semibold rounded hover:bg-red-700"
                >
                  Elimina
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

<div class=" p-6 pt-0 w-full mx-auto flex space-x-6 bg-gray-850">
  <div class="mb-4 grid grid-cols-1 gap-6 w-full">
                <div class="relative flex flex-col bg-clip-border rounded bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 w-full">
                  <div class="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
                  <h2 class="text-2xl font-bold mb-4">Attività Create</h2>
                  </div>
                  <div class="p-6 overflow-x-scroll px-0 pt-0 pb-2">
                    <table class="w-full min-w-[640px] table-auto">
                      <thead>
                        <tr>
                          <th class="border-b border-blue-gray-50 py-3 px-6 text-center">Nome</th>
                          <th class="border-b border-blue-gray-50 py-3 px-6 text-center">Partecipanti</th>
                          <th class="border-b border-blue-gray-50 py-3 px-6 text-center">Aggiorna</th>
                          <th class="border-b border-blue-gray-50 py-3 px-6 text-center">Elimina</th>
                          <th class="border-b border-blue-gray-50 py-3 px-6 text-center">Terminata</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="activity in activities" :key="activity.id">
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">{{ activity.name }}</td>
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">{{ activity.maxSlot - activity.remainingSlots}}</td>
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">
                            <button @click="openEditModal(activity)" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded" :disabled="activity.ended">Modifica</button>
                          </td>
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">
                            <button @click="deleteActivity(activity._id)" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded" :disabled="activity.ended">Elimina</button>
                          </td>
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">
                          <input
                              type="checkbox"
                              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              :checked="activity.ended"
                              disabled
                            />
                            {{activity.ended ? " Terminata" : " In corso"}}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
            
                <div v-if="editingActivity" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h2 class="text-lg font-semibold mb-4 text-center text-gray-800">Editing Model</h2>
                    <form @submit.prevent="saveUpdateActivity">
                      <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          v-model="editingActivity.name"
                          type="text"
                          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter activity name"
                        />
                      </div>
                      <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          v-model="editingActivity.place"
                          type="text"
                          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter activity location"
                        />
                      </div>
                      <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <Vue-DatePicker 
                          v-model="editingActivity.date"
                          format="yyyy-MM-dd HH:mm"
                          :show-time="true"
                          :min-date="minDate"
                          class="w-full border rounded-lg px-4 py-2 mt-2"
                          required
                        />
                      </div>
                      <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                        <input
                          v-model="editingActivity.maxSlot"
                          type="number"
                          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter activity location"
                        />
                      </div>
                      <div class="mt-6 flex justify-end space-x-2">
                        <button
                          type="button"
                          @click="closeEditModal"
                          class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>                
              </div>
            </div>
          
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
const base_api = "http://localhost:8000/api/v2";
export default {
  components: {
          VueDatePicker,
        },
  data() {
    return {
      users: [],
      searchQuery: "",
      activitiesReported: [],
      activities: [],
      editingActivity: null,
    };
  },
  methods: {
    async fetchMyActivities(){
            try{
              const res = await fetch(base_api + '/users/activities', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                    'Content-Type': 'application/json',
                }
              });
            this.activities = await res.json();
            }catch(error){
                console.error(error);
            }
          },

    async toggleComplete(activity){
              activity.completed = !activity.completed;
              await this.completeActitivy(activity);
            },

    async completeActitivy(activity){
        try{
                await fetch(base_api + `/users/delete/${this.activity.id}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': 'Bearer'+ localStorage.getItem('authToken'),
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(activity)
                });
                this.activities = this.activities.map(a => a.id === activity.id? activity : a);
              }catch(error){
                alert(error.message);
                console.error(error);
              }
            },


            openEditModal(activity){
                this.editingActivity = {...activity}; 
            },

            closeEditModal(){
                this.editingActivity = null;
            },

            async saveUpdateActivity(){
                try {
                  await fetch(base_api + `/users/activities/${this.editingActivity._id}`, {
                    method: 'PUT',
                    headers: {
                      'Authorization': 'Bearer '+ localStorage.getItem('authToken'),
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.editingActivity)
                  });
                  this.fetchMyActivities();
                  this.closeEditModal();
                }catch(error){
                  alert(error.message);
                  console.error(error);
                }
            },

            countParticipants(){
              return this.activities.reduce((acc, activity) => activity.maxSlot - activity.remainingSlots, 0);
            },

    async fetchUsers() {
      try {
        const res = await fetch(base_api + '/admin/manageUsers', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        this.users = data.users;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },

    async filterUsers() {
      if (this.searchQuery.trim() === "") {
        this.fetchUsers();
        return;
      }
      try {
        const response = await fetch(base_api + `/admin/manageUsers/${this.searchQuery}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await response.json();
        this.users = data;
      } catch (error) {
        console.error("Errore nella ricerca degli utenti", error);
      }
    },

    async promoteUser(userId) {
      try {
        const response = await fetch(base_api + `/admin/manageUsers/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          },
        });
        const data = await response.json();
        if (response.ok) {
          this.fetchUsers();
          alert("Utente promosso ad admin");
        } else {
          alert(data.message || "Errore durante la promozione");
        }
      } catch (error) {
        console.error("Errore nella promozione", error);
      }
    },

    async deleteUser(userId){
      const confirmed = confirm("Continuare con l'eliminazione dell'utente ?");

      if(!confirmed){
        return;
      }

      try{
        const response = await fetch(base_api + `/admin/manageUsers/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          },
        });
        const data = await response.json();
        if(response.ok) {
          this.users = this.fetchUsers();
          alert("Eliminazione utente avvenuta con successo");
        }
        else{
          alert(data.message || "Errore durante l'eliminazione");
        }
      }catch(error){
          console.error("Errore nell'eliminazione", error);
      }
    },

    async fetchReportedActivities() {
  try {
    const response = await fetch(base_api + '/admin/manageActivities', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 205) {
      this.activitiesReported = []; 
    } else if (response.status === 200) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        this.activitiesReported = data;
      } else {
        this.activitiesReported = [];
      }
    }
  } catch (error) {
    console.error('Error fetching reported activities:', error);
    alert('Errore durante il recupero delle attività segnalate.');
  }
},


  async deleteActivity(activityId) {
      const confirmed = confirm("Continuare con l'eliminazione dell'utente ?");

      if(!confirmed){
        return;
      }
    try {
      const response = await fetch(base_api + `/admin/manageActivities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await this.fetchReportedActivities();
        await this.fetchMyActivities(); 
        alert('Attività eliminata con successo');
      } else {
        const data = await response.json();
        alert(data.message || 'Errore durante l\'eliminazione dell\'attività');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Errore durante l\'eliminazione dell\'attività');
    }
  }

  },

  mounted() {
    this.fetchUsers();
    this.fetchReportedActivities();
    this.fetchMyActivities();
  },
};
</script>

<style scoped>
  table {
    width: 100%;
  }
</style>