<template>
    <div class="min-h-screen bg-gray-800 flex flex-col justify-center items-center">
        <form @submit.prevent="handleRegister" class="bg-white p-10 rounded-lg shadow-lg w-96">
            <h1 class="text-2xl font-bold mb-6 text-gray-700 text-center">Register</h1>

            <div class="mb-4">
                <label for="name" class="block text-gray-600 font-medium">Name</label>
                <input
                    v-model="name"
                    type="text"
                    id="name"
                    placeholder="Choose a name"
                    class="w-full border rounded-lg px-4 py-2 mt-2"
                />
            </div>

            <div class="mb-4">
                <label for="surname" class="block text-gray-600 font-medium">Surname</label>
                <input
                    v-model="surname"
                    type="text"
                    id="surname"
                    placeholder="Choose a surname"
                    class="w-full border rounded-lg px-4 py-2 mt-2"
                />
            </div>

            <div class="mb-4">
                <label for="username" class="block text-gray-600 font-medium">Username</label>
                <input
                    v-model="username"
                    type="text"
                    id="username"
                    placeholder="Choose a username"
                    class="w-full border rounded-lg px-4 py-2 mt-2"
                />
            </div>

            <div class="mb-4">
                <label for="email" class="block text-gray-600 font-medium">Email</label>
                <input
                    v-model="email"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    class="w-full border rounded-lg px-4 py-2 mt-2"
                />
            </div>

            <div class="mb-4">
                <label for="password" class="block text-gray-600 font-medium">Password</label>
                <input
                    v-model="password"
                    type="password"
                    id="password"
                    placeholder="Enter a password"
                    class="w-full border rounded-lg px-4 py-2 mt-2"
                />
            </div>

            <button
                type="submit"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg mt-4"
            >
                Register
            </button>

            <p class="mt-4 text-sm text-center text-gray-600">
                Already have an account?
                <router-link to="/login" class="text-indigo-600 font-bold">Login</router-link>
            </p>
        </form>
    </div>
</template>

<script>
import { registerUser } from '@/authService';  // Assicurati che la funzione registerUser sia importata correttamente

export default {
    data() {
        return {
            name: '',
            surname: '',
            username: '',
            email: '',
            password: ''
        };
    },
    methods: {
        async handleRegister() {
            // Chiamata al servizio per la registrazione
            const result = await registerUser(this.name, this.surname, this.username, this.email, this.password);

            if (result.success) {
                // Se la registrazione ha successo, redirige l'utente alla home
                this.$router.push('/0');
            } else {
                // In caso di errore, mostra un messaggio di errore
                alert(result.message || 'Registrazione fallita!');
            }
        }
    }
}
</script>
