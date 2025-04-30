<template>
    <div class="relative w-full max-w-m rounded-2xl border-gray-200 p-5 overflow-hidden"
        :class="{'border-2 border-gray-700 bg-white': isExpanded},
                {'bg-gray-200': !isExpanded}">
        <div class="flex flex-col text-black transition-opacity duration-300">
            <h2 class="font-medium text-xl">{{ activity.name }}</h2>
            <span class="block text-sm mb-1">
                created by <span class="font-semibold text-indigo-700">{{ activity.creator }}</span>
            </span>

            <div class="absolute top-4 right-4 z-10">
                <button
                    class="flex-1 px-2 py-2 bg-white font-semibold rounded-lg shadow-md hover:bg-gr-100 transition-colors duration-300 mx-1 transform"
                    :class="{ 'scale-110': isExpanded }"
                    @click="toggleExpand"
                    :disabled="isSaving || isReporting"
                >
                    <img src="../assets/menu-dots-vertical.png" class="w-4 h-4">
                </button>
            </div>

            <div v-if="isExpanded" class="mt-4 text-sm text-gray-600">
                <p><span class="font-semibold text-black ">Luogo </span> {{ activity.place }}</p>
                <p><span class="font-semibold text-black">Data :</span> {{ activity.date }}</p>
                <div class="mt-4 mb-4">
                    <p class="text-sm text-gray-600">
                        L'attività si svolgerà tra: {{ timeRemaining }} giorni
                    </p>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div :style="{ width: progress + '%'}" class="bg-indigo-600 h-2.5 rounded-full"></div>
                    </div>
                </div>
                
                <div class="mt-3 flex justify-between z-10">
                    <button
                        class="flex-1 px-4 py-2 bg-white text-indigo-700 font-semibold rounded-lg shadow-md hover:bg-indigo-100 transition-colors duration-300 mx-1"
                        @click="saveActivity"
                        :disabled="isSaving"
                    >
                        {{ isSaving ? 'Saving...' : 'Save' }}
                    </button>

                    <button
                        class="w-12 h-10 flex items-center justify-center bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
                        @click="reportActivity"
                        :disabled="isReporting"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                        </svg>
                    </button>
                </div>
            </div>            
        </div>        
    </div>
</template>

<script>
const base_url = "http://localhost:8000/api/v2";
export default {
    props: {
        activity: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            isSaving: false,
            isReporting: false,
            isExpanded: false,
            progress: 0, // Percentuale di progresso della barra
            timeRemaining: 0 // Tempo rimanente fino all'attività
        };
    },

    computed: {
        // Calcolare il tempo rimanente
        timeRemaining() {
            const now = new Date();
            const activityDate = new Date(this.activity.date); // Assumendo che l'attività abbia una data di inizio

            const remainingTime = (activityDate - now) / (1000 * 60 * 60 * 24); // Tempo rimanente in giorni
            return Math.max(remainingTime, 0).toFixed(1); // Non permettere valori negativi
        }
    },

        // Funzione per calcolare il progresso in base al tempo rimanente
methods: {
        calculateProgress() {
        const now = new Date();
        const activityDate = new Date(this.activity.date);

        // Calcola la differenza in giorni
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const diffInMs = activityDate - now;
        const diffInDays = Math.ceil(diffInMs / millisecondsPerDay);

        if (diffInDays > 365) {
            this.progress = 0;
            return;
        }

        const progress = ((365 - diffInDays) * 100) / 365;
        this.progress = Math.min(Math.max(progress, 0), 100); // Clamp tra 0 e 100
        },


        toggleExpand() {
            this.isExpanded = !this.isExpanded;

            if(this.isExpanded){
                this.$emit('focus-activity', this.activity);
            }
            else{
                this.$emit('focus-activity', null);
            }
        },

        async saveActivity() {
            this.isSaving = true;
            try {
                const res = await fetch(base_url + `/join/${this.activity.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                        'Content-Type': 'application/json'
                    },
                });

                if (res.ok) {
                    alert('Activity joined successfully');
                } else {
                    const errorData = await res.json();
                    alert(`Error: ${errorData.message || 'Failed to join activity'}`);
                }
            } catch (e) {
                console.error('Error saving activity:', e);
                alert('An unexpected error occurred while saving the activity');
            } finally {
                this.isSaving = false;
            }
        },

        async reportActivity() {
            this.isReporting = true;
            try {
                const res = await fetch(base_url + `/report/${this.activity.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    alert("Activity reported successfully");
                } else {
                    const errorData = await res.json();
                    alert(`Error: ${errorData.message || 'Failed to report activity'}`);
                }
            } catch (e) {
                console.error('Error reporting activity:', e);
                alert('An unexpected error occurred while reporting the activity');
            } finally {
                this.isReporting = false;
            }
        }
    },

    // Esegui il calcolo del progresso ogni volta che il componente è montato
    mounted() {
        this.calculateProgress();
        setInterval(this.calculateProgress, 6000); // Ricalcola ogni minuto
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

.overflow-hidden {
    overflow: hidden;
}

* {
    font-family: 'DM Sans', sans-serif;
}

/* Aggiungi un'animazione per l'ingrandimento */
.scale-110 {
    transform: scale(1.1);
    transition: transform 0.3s ease-in-out;
}
</style>
