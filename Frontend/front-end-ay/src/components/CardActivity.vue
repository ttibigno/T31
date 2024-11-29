<template>
    <div class="flex-shrink-0 relative overflow-hidden bg-indigo-700 rounded-lg max-w-md shadow-lg h-30">
        <svg
            class="absolute bottom-0 left-0 mb-6"
            viewBox="0 0 375 283"
            fill="none"
            style="transform: scale(1.5); opacity: 0.1;"
        >
            <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white" />
            <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white" />
        </svg>
        <div class="relative pt-10 px-10 flex items-center justify-center">
            <div
                class="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                style="background: radial-gradient(black, transparent 60%); transform: rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1); opacity: 0.2;"
            ></div>
        </div>
        <div class="relative text-white px-10 pb-6 -mt-6 ">
                <span class="block opacity-75 -mb-1">{{ activity.Creator }}</span>
            <div class="flex justify-left">
                <span class="block font-semibold text-xl">{{ activity.NameEvent }}</span>
            </div>
            <button class=" absolute inline-flex bottom-3.5 right-2 text-white-700 hover:text-white border border-white-700 hover:bg-white-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-white-500 dark:text-white dark:hover:text-white dark:hover:bg-indigo-700 dark:focus:ring-white-900">save</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        activity: {
            type: Object,
            required: true,
        },
    },
};
</script>
