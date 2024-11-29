<template>
    <div class="relative ">
        <img
            @click.prevent="togglePopup"
            class="w-10 h-10 cursor-pointer bg-indigo-400 rounded-full "
            src="@/assets/icon2.png"
            alt="icon"
        />
        <div
            v-if="IsShowPopup"
            class="absolute transform -translate-x-40 translate-y-8 bg-white text-gray-900 shadow-lg rounded-md w-52 p-4 z-50"
        >
            <p class="font-bold mb-3 text-center">
                Accedi, o registrati
                <!-- Devo aggiungere poi {{ User }} e controllo del token per cambiare il modo -->
            </p>
            <button
                id="register"
                class="w-full bg-blue-700 hover:bg-indigo-900 text-white py-2 px-4 rounded-full mb-2"
                type="button"
            >
                Register
            </button>
            <button
                id="login"
                class="w-full bg-blue-700 hover:bg-indigo-900 text-white py-2 px-4 rounded-full"
                type="button"
            >
                Login
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {

    setup() {
        const IsShowPopup = ref(false);
        const togglePopup = () => {
            IsShowPopup.value = !IsShowPopup.value;
        };
        return { IsShowPopup, togglePopup };
    },
};
</script>

