import { createRouter, createWebHashHistory } from 'vue-router';
import { jwtDecode } from 'jwt-decode'; // Usa jwt-decode per decodificare il token

import CreateActivity from './components/CreateForm.vue';
import Login from './components/LoginForm.vue';
import Register from './components/RegisterForm.vue';
import Dashboard from './components/personal-area/Dashboard.vue';
const Home = () => import('./components/personal-area/UserHome.vue');
const SavedActivities = () => import('./components/personal-area/Saved.vue');
const Settings = () => import('./components/personal-area/Settings.vue');
const HomePage = () => import('./components/HomePage.vue');
const AdminPage = () => import('./components/admin/adminPage.vue');
const FirstPage = () => import('./components/FirstPage.vue');

// Funzione per ottenere il token dal localStorage
const getToken = () => localStorage.getItem('authToken');

const requireAuth = (to, from, next) => {
    const token = getToken();
    if (!token) {
        next({ path: '/login' });
    } else {
        next();
    }
};

const requireAdmin = (to, from, next) => {
    const token = getToken();
    const role = localStorage.getItem('role');
    if (token) {
        if (role === "true") {
            next();
        } else {
            next({ path: '/dashboard' });
        }
    } else {
        next({ path: '/login' });
    }
};

const redirectIfAuthenticated = (to, from, next) => {
    const token = getToken();
    const role = localStorage.getItem('role');
    if (token) {
        if (role === "true") {
            next({ path: '/AdminBoard' });
        } else {
            next({ path: '/dashboard' });
        }
    } else {
        next();
    }
};

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '',
            component: HomePage,
            name: 'HomePage',
        },
        {
            path: '/0',
            component: FirstPage,
            name: 'FistPage',
        },
        {
            path: '/createActivity',
            component: CreateActivity,
            name: 'createActivity',
            beforeEnter: requireAuth,
        },
        {
            path: '/login',
            component: Login,
            name: 'login',
            beforeEnter: redirectIfAuthenticated,
        },
        {
            path: '/register',
            component: Register,
            name: 'register',
            beforeEnter: redirectIfAuthenticated,
        },
        {
            path: '/dashboard',
            component: Dashboard,
            name: 'dashboard',
            beforeEnter: (to, from, next) => {
                const token = getToken();
                const role = localStorage.getItem('role');
                if (!token) {
                    next({ path: '/login' });
                } else {
                    if (role === "true") {
                        next({ path: '/AdminBoard' });
                    } else {
                        next();
                    }
                }
            },
            children: [
                {
                    path: '',
                    name: 'dashboard-home',
                    component: Home,
                },
                {
                    path: 'Saved',
                    name: 'dashboard-saved',
                    component: SavedActivities,
                },
                {
                    path: 'Settings',
                    name: 'dashboard-settings',
                    component: Settings,
                },
            ],
        },
        {
            path: '/AdminBoard',
            component: AdminPage,
            name: 'adminBoard',
            beforeEnter: requireAdmin,
        },
    ],
});

export default router;
