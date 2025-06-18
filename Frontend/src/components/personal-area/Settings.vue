<template>
  <div class="max-w-lg mx-auto mt-36 bg-gray-800 h-screen felx items-center">
    <div class="bg-indigo-950 text-white rounded-lg shadow-lg overflow-hidden">
      <div class="p-6 flex items-center border-b border-gray-700">
        <svg 
          aria-hidden="true" 
          role="img" 
          class="h-16 w-16 text-gray-300 rounded-full"
          viewBox="0 0 256 256">
          <path fill="currentColor" d="M172 120a44 44 0 1 1-44-44a44 44 0 0 1 44 44Zm60 8A104 104 0 1 1 128 24a104.2 104.2 0 0 1 104 104Zm-16 0a88 88 0 1 0-153.8 58.4a81.3 81.3 0 0 1 24.5-23a59.7 59.7 0 0 0 82.6 0a81.3 81.3 0 0 1 24.5 23A87.6 87.6 0 0 0 216 128Z"></path>
        </svg>
        <div class="ml-4">
          <p class="text-lg font-semibold">{{ userData.username || 'Caricamento...' }}</p>
          <p class="text-sm text-gray-400">{{ userData.email || 'Email non disponibile' }}</p>
          <button 
            @click="toggleEditing" 
            class="mt-4 px-4 py-2 bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow hover:bg-indigo-800">
            {{ isEditing ? 'Indietro' : 'Gestisci Account' }}
          </button>
        </div>
      </div>
      <div v-if="isEditing" class="p-6">
        <label class="block text-gray-300 text-sm">Username</label>
        <input v-model="userData.username" class="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded" />

        <label class="block text-gray-300 text-sm mt-4">Email</label>
        <input v-model="userData.email" class="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded" />
        
        <button 
          @click="saveChanges" 
          class="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow hover:bg-indigo-700">
          Salva
        </button>

        <!-- Error message if there's an issue -->
        <p v-if="errorMessage" class="text-red-500 text-sm mt-4">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- New div for Change Password and Delete Account -->
    <div class="mt-4 bg-gray-100 p-6 rounded-lg shadow-lg">
      <p class="text-lg font-semibold text-black-600">Password e Autenticazione</p>
      <p class="text-xs text-gray-700">Cambia la password per proteggere il tuo account</p>
      <button  
        class="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow hover:bg-indigo-700">
        Modifica Password
      </button>

      <hr class="my-6 border-gray-300" />

      <p class="text-lg font-semibold text-gray-900">Elimina Account</p>
      <p class="text-xs text-gray-700">Elimina l'account associato alla tua mail, con tutte le tue attività create</p>
      <button 
        @click="deleteAccount" 
        class="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg shadow hover:bg-red-700">
        Elimina account
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {},
      isEditing: false,
      errorMessage: null,
    };
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await fetch('https://backend-aroundyou.onrender.com/api/v2/users/private', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          this.userData = await response.json();
        } else {
          this.errorMessage = 'Unable to fetch user data.';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        this.errorMessage = 'An error occurred while fetching user data.';
      }
    },
    toggleEditing() {
      this.isEditing = !this.isEditing;
      this.errorMessage = null; // reset error message when toggling edit mode
    },
    async saveChanges() {
      try {
        const response = await fetch('https://backend-aroundyou.onrender.com/api/v2/users/private', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.userData.username,
            email: this.userData.email,
          })
        });

        if (response.ok) {
          this.isEditing = false;
          this.errorMessage = null;
          const data = await response.json();
          this.userData = data.user || this.userData;
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.error || 'Un errore si è presentato durante il salvataggio.';
        }
      } catch (error) {
        console.error('Un errore si è presentato durante il salvataggio: ', error);
        this.errorMessage = 'Un errore si è presentato durante il salvataggio.';
      }
    },
    async deleteAccount() {
      try {
        const confirmDelete = confirm('Sei sicuro di voler eliminare il tuo profilo?');
        if (!confirmDelete) return;

        const response = await fetch('https://backend-aroundyou.onrender.com/api/v2/users/private', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Your account has been deleted.');
          localStorage.removeItem('authToken');
          this.$router.push('/login'); // redirect to login page after delete
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.error || 'Failed to delete account.';
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        this.errorMessage = 'An error occurred while deleting your account.';
      }
    },
  },
  mounted() {
    this.fetchUserData();
  }
};
</script>
