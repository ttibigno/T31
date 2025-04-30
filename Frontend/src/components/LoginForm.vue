<template>
    <div class="min-h-screen bg-gray-800 flex flex-col justify-center items-center">
        <form @submit.prevent="handleLogin" class="bg-white p-10 rounded-lg shadow-lg w-96">
            <h1 class="text-2xl font-bold mb-6 text-gray-700 text-center">Login</h1>
            <div class="mb-4">
                <label for="username" class="block text-gray-600 font-medium">Username</label>
                <input
                    v-model="username" 
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    class="w-full border rounded-lg px-4 py-2 mt-2"
                />
            </div>
            <div class="mb-4">
                <label for="password" class="block text-gray-600 font-medium">Password</label>
                <input
                    v-model="password"  
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    class="w-full border rounded-lg px-4 py-2 mt-2"
                />
            </div>
            <button
                type="submit"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg mt-4"
            >
                Login
            </button>
            <div class="img-container" >
            <img src=".././assets/icons8-logo-di-google-48.png" class="mx-auto w-8 h-8">
            </div>            
            <p class="mt-6 text-sm text-center text-gray-600">
                Non hai un account?
                <router-link to="/register" class="text-indigo-600 font-bold">Registrati</router-link>
            </p>
            <p class="mt-1 text-sm text-center text-gray-600">
            </p>
        </form>
    </div>
</template>

<script>
import { loginUser } from '../authService.js';
import eventBus from '@/eventBus.js';
import {jwtDecode} from 'jwt-decode';

export default {
    emits: ['update:isAuthenticated'],
    data() {
        return {
            username: '',  
            password: '',
        };
    },
    methods: {
        async handleLogin() {
        const result = await loginUser(this.username, this.password);
        if (result.success) {
            try {
                const role = localStorage.getItem('role');
                console.log(role);

                eventBus.emit('loginSuccess'); 

                if (role === "true") {
                    this.$router.push('/AdminBoard');
                } else {
                    this.$router.push('/dashboard');
                }

            } catch (e) {
                console.error('Error decoding token:', e);
                alert('Errore nella elaboreazione dell`accesso');
                return;
            }
        } else {
            alert('Login fallito');
        }
}

}
};
</script>

<style scoped>
.img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top : 28px;
}
</style>

