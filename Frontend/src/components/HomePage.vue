<template>
    <body class="flex flex-col items-center justify-center min-h-screen min-w-full bg-gray-900 text-white text-center px-6">
        <!-- Testo principale con effetto fade-in -->
        <h1 class="text-4xl md:text-5xl font-bold mb-6 animate-fade-in text-center">
            Siete pronti a non scervellarvi più su cosa fare <br />
            durante i momenti morti, e permettere agli altri <br />
            di sviluppare con te i tuoi hobby?
        </h1>

        <!-- Bottoni -->
        <div class="flex gap-6 mt-4">
            <button 
                class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
                @click="register()"
            >
                Registrati
            </button>

            <button 
                class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105"
                @click="explore()"
            >
                Esplora
            </button>
        </div>
    </body>
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
}
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
