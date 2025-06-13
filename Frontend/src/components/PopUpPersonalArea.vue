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
                class="w-full bg-blue-700 hover:bg-indigo-900 text-white py-2 px-4 rounded-full"
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import eventBus from '@/eventBus';

export default {
    setup() {
        const router = useRouter();
        const IsShowPopup = ref(false);
        const isAuthenticated = ref(false);

        const togglePopup = () => {
            IsShowPopup.value = !IsShowPopup.value;
        };

        const checkIsAuthenticated = () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                isAuthenticated.value = false;
                return;
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                if (payload.exp && payload.exp < currentTime) {
                    alert("La sessione è scaduta. Verrai reindirizzato al login.");
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('role');
                    isAuthenticated.value = false;
                    router.push('/login');
                    return;
                }

                isAuthenticated.value = true;
            } catch (e) {
                console.error("Errore nel parsing del token:", e);
                localStorage.removeItem('authToken');
                isAuthenticated.value = false;
            }
        };

        const goToLogin = () => {
            closePopUp();
            router.push('/login');
        };

        const goToRegister = () => {
            closePopUp();
            router.push('/register');
        };

        const goToDashboard = () => {
            closePopUp();
            router.push('/Dashboard');
        };

        const logout = () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            isAuthenticated.value = false;
            closePopUp();
            router.push('/login');
        };

        const closePopUp = () => {
            IsShowPopup.value = false;
        };

        onMounted(() => {
            eventBus.on('loginSuccess', () => {
                checkIsAuthenticated();
            });

            checkIsAuthenticated();
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
