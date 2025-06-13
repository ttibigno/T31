<template>
    <div class="min-h-screen bg-gray-800">
        <div class="p-4">
          <div class="mt-20">
            <div class="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
              <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-6 h-6 text-white">
                    <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                    <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd"></path>
                    <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
                  </svg>
                </div>
                <div class="p-4 text-right">
                  <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Attività create</p>
                  <h4 class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{{activities.length}}</h4>
                </div>
                <div class="border-t border-blue-gray-50 p-4">
                  <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                  dall'inizio
                  </p>
                </div>
              </div>
              <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                <div class="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-6 h-6 text-white">
                    <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="p-4 text-right">
                  <p class="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Partecipazioni totali</p>
                  <h4 class="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{{countParticipants()}}</h4>
                </div>
                <div class="border-t border-blue-gray-50 p-4">
                  <p class="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                    aggiornate ora
                  </p>
                </div>
              </div>
              
            </div>
            
            <div class="mb-4 grid grid-cols-1 gap-6">
                <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
                  <div class="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
                    <div>
                      <h2 class="text-2xl font-bold mb-4">Attività Create</h2>                    
                      </div>
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
                            <button @click="openEditModal(activity)" 
                            class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                            :disabled="activity.ended"
                            >
                            Aggiorna</button>
                          </td>
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">
                            <button @click="deleteActivity(activity._id)" 
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            :disabled="activity.ended"
                            >
                            Elimina</button>
                          </td>
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center"
                          >
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
                    <h2 class="text-lg font-semibold mb-4 text-center text-gray-800">Modulo di aggiornamento</h2>
                    <form @submit.prevent="saveUpdateActivity">
                      <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input
                          v-model="editingActivity.name"
                          type="text"
                          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nome dell'attività"
                        />
                      </div>
                      <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Luogo</label>
                        <input
                          v-model="editingActivity.place"
                          type="text"
                          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Location dell' attività"
                        />
                      </div>
                      <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
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
                        <label class="block text-sm font-medium text-gray-700 mb-1">Partecipanti</label>
                        <input
                          v-model="editingActivity.maxSlot"
                          type="number"
                          class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Slot totali dell'attività"
                        />
                      </div>
                      <div class="mt-6 flex justify-end space-x-2">
                        <button
                          type="button"
                          @click="closeEditModal"
                          class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition"
                        >
                          Annulla
                        </button>
                        <button
                          type="submit"
                          class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition"
                        >
                          Salva
                        </button>
                      </div>
                    </form>
                  </div>
                </div>                
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
    const base_url = "http://localhost:8000/api/v2";
    export default{
        components: {
          VueDatePicker,
        },

        data(){
            return {
                activities: [],
                editingActivity: null,
            };
        },

        methods: {
          async fetchMyActivities(){
            try{
              const res = await fetch(base_url + '/users/activities', {
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

            async deleteActivity(id){
              const confirmed = confirm("Continuare con l'eliminazione dell'attività ?")

              if(!confirmed){
                return;
              }

                try{
                    await fetch(base_url + `/users/activities/${id}`, 
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer '+ localStorage.getItem('authToken'),
                            'Content-Type': 'application/json',
                        }
                    });
                    this.activities = this.fetchMyActivities();
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
                  await fetch(base_url + `/users/activities/${this.editingActivity._id}`, {
                    method: 'PUT',
                    headers: {
                      'Authorization': 'Bearer '+ localStorage.getItem('authToken'),
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.editingActivity)
                  });
                  await this.fetchMyActivities;

                  window.location.reload();
                  this.closeEditModal();
                }catch(error){
                  alert(error.message);
                  console.error(error);
                }
            },

            countParticipants(){
              if (Array.isArray(this.activities)) {
                return this.activities.reduce((acc, activity) => acc + activity.maxSlot - activity.remainingSlots, 0);
              }
              return 0; 
            }

        },

        mounted(){
            this.fetchMyActivities();
        }
            
    }
</script>