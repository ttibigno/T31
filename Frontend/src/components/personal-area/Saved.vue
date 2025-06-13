<template>
    <div class="min-h-screen bg-gray-800">
        <div class="p-4">
          <div class="mt-20">            
            <div class="mb-4 grid grid-cols-1 gap-6">
                <div class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
                  <div class="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
                    <div>
                      <h2 class="text-2xl font-bold mb-4">Attività Salvate</h2>                    
                      </div>
                    </div>
                  <div class="p-6 overflow-x-scroll px-0 pt-0 pb-2">
                    <table class="w-full min-w-[640px] table-auto">
                      <thead>
                        <tr>
                          <th class="border-b border-blue-gray-50 py-3 px-6 text-center">Nome</th>
                          <th class="border-b border-blue-gray-50 py-3 px-6 text-center">Data</th>
                          <th class="border-b border-blue-gray-50 py-3 px-6 text-center">Luogo</th>
                          <th class="border-b border-blue-gray-50 py-3 px-6 text-center">Riporta</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="activity in activities" :key="activity.id">
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">{{ activity.name }}</td>
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">{{ activity.date }}</td>
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">{{ activity.place }}</td>
                          <td class="py-3 px-5 border-b border-blue-gray-50 text-center">
                            <button @click="report(activity)" class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Riporta</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
            
                </div>
          </div>
        </div>
    </div>
</template>

<script>
const base_url = "https://backend-aroundyou.onrender.com/api/v2";
export default {
  data() {
    return {
      activities: [],
    };
  },
  methods: {
    async fetchMySaved() {
      try {
        const res = await fetch(base_url + '/join', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
            'Content-Type': 'application/json',
          }
        });

        // Verifica se la risposta è corretta (status 200 OK)
        if (res.ok) {
          const data = await res.json();

          // Verifica se data è un array e contiene elementi
          if (Array.isArray(data) && data.length > 0) {
            this.activities = data;
          } else {
            console.error('Nessuna attività trovata o la risposta è vuota');
            this.activities = [];
          }
        } else {
          console.error('Errore nella risposta del server:', res.status);
          this.activities = [];
        }
      } catch (error) {
        console.error('Errore durante il fetch delle attività:', error);
        this.activities = [];
      }
    },
  },
  created() {
    this.fetchMySaved();
  }
};

</script>