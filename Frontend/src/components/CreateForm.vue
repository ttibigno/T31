<template>
  <div class="min-h-screen bg-gray-800 flex flex-col justify-center items-center">
    <form @submit.prevent="handleActivity" class="bg-white p-10 rounded-lg shadow-lg w-96">
      <h1 class="text-2xl font-bold mb-6 text-gray-700 text-center">Crea Attività</h1>

      <!-- Titolo attività -->
      <div class="mb-4">
        <label for="name" class="block text-gray-600 font-medium">Nome Attività</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          placeholder="Dai un titolo all'attività"
          class="w-full border rounded-lg px-4 py-2 mt-2"
          required 
        />
      </div>

      <!-- Luogo -->
      <div class="mb-4">
        <label for="place" class="block text-gray-600 font-medium">Luogo</label>
        <input 
          id="place" 
          v-model="place" 
          placeholder="Ex: Piazza Dante, TN, Trento"
          class="w-full border rounded-lg px-4 py-2 mt-2"
        />
      </div>

      <!-- Topic -->
      <div class="mb-4">
        <label class="block text-gray-600 font-medium">Topics</label>
        <div class="flex items-center gap-2">
          <input 
            type="text" 
            v-model="newTopic"
            placeholder="Aggiungi un topic"
            class="w-full border rounded-lg px-4 py-2"
          />
          <button 
            type="button"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            @click="addTopic"
          >
            +
          </button>
        </div>
        <ul class="mt-2">
          <li 
            v-for="(topic, index) in topics" 
            :key="index" 
            class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg inline-flex items-center gap-2 mt-2 mr-2"
          >
            {{ topic }}
            <button 
              type="button" 
              class="text-red-600 font-bold hover:text-red-800"
              @click="removeTopic(index)"
            >
              ×
            </button>
          </li>
        </ul>
      </div>

      <!-- Max numero partecipanti -->
      <div class="mb-4">
        <label for="maxSlot" class="block text-gray-600 font-medium">Numero massimo di partecipanti</label>
        <input 
          type="number" 
          id="maxSlot" 
          v-model="maxSlot" 
          placeholder="Numero di posti"
          class="w-full border rounded-lg px-4 py-2 mt-2"
          min="1"
          required
        />
      </div>

      <!-- Data e ora dell'attività -->
      <div class="mb-4">
        <label for="datetime" class="block text-gray-600 font-medium">Data e ora dell'attività</label>
        <Vue-DatePicker 
          v-model="datetime"
          format="yyyy-MM-dd HH:mm"
          :show-time="true"
          :min-date="minDate"
          class="w-full border rounded-lg px-4 py-2 mt-2"
          required
        />
      </div>

      <!-- Bottone per invio -->
      <button 
        type="submit" 
        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Creando...' : 'Crea attività' }}
      </button>
    </form>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { CreateActivity } from '@/Services.js';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export default {
  components: {
    VueDatePicker,
  },
  data() {
    return {
      name: '',
      topics: [],
      newTopic: '',
      place: '',
      datetime: '',
      minDate: new Date().toISOString().slice(0, 10),
      isSubmitting: false,
      maxSlot: 1,
    };
  },

  methods: {
    addTopic() {
      if (this.newTopic.trim() && !this.topics.includes(this.newTopic.trim())) {
        this.topics.push(this.newTopic.trim());
        this.newTopic = ''; 
      }
    },

    removeTopic(index) {
      this.topics.splice(index, 1);
    },

async handleActivity() {
  if (!this.name || !this.datetime || !this.topics || !this.maxSlot) {
    alert('Riempi tutti i campi.');
    return;
  }

  const date = new Date(this.datetime);
  // Convertiamo la data alla zona di Roma (fuso orario Europe/Rome)
  const options = { timeZone: 'Europe/Rome', hour12: false };
  const romeDatetime = date.toLocaleString('en-US', options);

  // Log per vedere se toLocaleString funziona
  console.log("Rome DateTime:", romeDatetime);

  // Inizializza il formato
  const formattedDatetime = romeDatetime.replace(',', '');

  this.isSubmitting = true;

  try {
    const result = await CreateActivity(this.name, this.topics, this.place, formattedDatetime, this.maxSlot);

    if (result.success) {
      alert('Activity created successfully!');
      this.$router.push('/0');
    } else {
      alert('Failed to create activity');
    }
  } catch (error) {
    console.error('Error creating activity:', error);
    alert('An unexpected error occurred.');
  } finally {
    this.isSubmitting = false;
  }
}
}
};
</script>
