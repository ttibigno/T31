<template>
    <div class="relative">
        <img
            @click.prevent="togglePopup"
            class="w-10 h-10 cursor-pointer bg-indigo-400 rounded-full"
            src="@/assets/icon2.png"
            alt="icon"
        />
        <div
            v-if="IsShowPopup"
            class="absolute transform -translate-x-40 translate-y-8 bg-white text-gray-900 shadow-lg rounded-md w-52 p-4 z-50 space-y-1"
        >
            <p v-if="!isAuthenticated" class="font-bold mb-3 text-center">
                Accedi o Registrati
            </p>
            <button
                v-if="!isAuthenticated"
                @click="goToLogin"
                id="login"
                class="w-full bg-blue-700 hover:bg-indigo-900 text-white py-2 px-4 rounded-full"
                type="button"
            >
                Login
            </button>
            <button
                v-if="!isAuthenticated"
                @click="goToRegister"
                id="register"
                class="w-full bg-blue-700 hover:bg-indigo-900 text-white py-2 px-4 rounded-full"
                type="button"
            >
                Register
            </button>
            <button
                v-if="isAuthenticated"
                @click="goToDashboard"
                id="dashboard"
                class="w-full bg-blue-700 hover:bg-indigo-900 text-white py-2 px-4 rounded-full "
                type="button"
            >
                Dashboard
            </button>
            <button
                v-if="isAuthenticated"
                @click="logout"
                id="logout"
                class="w-full bg-red-700 hover:bg-red-900 text-white py-2 px-4 rounded-full"
                type="button"
            >
                Logout
            </button>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import eventBus from '@/eventBus';

export default {
    setup() {
        const router = useRouter();
        // Stati reattivi
        const IsShowPopup = ref(false);
        const isAuthenticated = ref(false); // Stato di autenticazione

        // Funzione per mostrare/nascondere il popup
        const togglePopup = () => {
            IsShowPopup.value = !IsShowPopup.value;
        };

        // Funzione per controllare se l'utente è autenticato
        const checkIsAuthenticated = () => {
            const token = localStorage.getItem('authToken');
            isAuthenticated.value = token !== null; // Aggiorna lo stato di autenticazione
        };

        // Funzione per navigare alla pagina di login
        const goToLogin = () => {
            closePopUp();
            router.push('login');
        };

        // Funzione per navigare alla pagina di registrazione
        const goToRegister = () => {
            closePopUp();
            router.push('register');
        };

        // Funzione per navigare alla dashboard
        const goToDashboard = () => {
            closePopUp();
            router.push('Dashboard');
        };

        // Funzione per fare il logout
        const logout = () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            isAuthenticated.value = false; // Aggiorna lo stato di autenticazione
            closePopUp(); // Chiude il popup
            router.push('/0'); // Reindirizza alla pagina iniziale (login)
        };

        // Funzione per chiudere il popup
        const closePopUp = () => {
            IsShowPopup.value = false; // Modifica lo stato del popup
        };

        // Controlla lo stato di autenticazione al montaggio del componente
        onMounted(() => {
            eventBus.on('loginSuccess', ()=>{
                isAuthenticated.value = true;
            })
            checkIsAuthenticated();
        });

        watch(isAuthenticated, (newValue) => {
            if (newValue) {
                closePopUp();
            } else {
                closePopUp();
            }
        });

        return {
            IsShowPopup,
            togglePopup,
            isAuthenticated,
            goToLogin,
            goToRegister,
            goToDashboard,
            logout,
        };
    }
};
</script>
