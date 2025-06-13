<template>
    <div class="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center px-6 relative overflow-hidden">
  
  
      <!-- Testo principale -->
      <h1 class="text-3xl md:text-5xl font-bold mb-8 animate-fade-in leading-relaxed z-10">
        Siete pronti a non scervellarvi più su cosa fare<br />
        nei momenti morti? Scopri e condividi i tuoi hobby!
      </h1>
  
      <!-- CTA Buttons -->
      <div class="flex flex-wrap gap-4 justify-center z-10">
        <button
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
          @click="register"
        >
          Registrati
        </button>
  
        <button
          class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
          @click="explore"
        >
          Esplora
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      register() {
        this.$router.push('/register');
      },
      explore() {
        this.$router.push('/0');
      }
    }
  };
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 1.5s ease-out;
  }
  </style>
  