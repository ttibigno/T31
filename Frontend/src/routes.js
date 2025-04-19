import { createRouter, createWebHashHistory } from 'vue-router';
import PageViewer from './components/PageViewer.vue';
import CreateActivity from './components/CreateForm.vue';
import Login from './components/LoginForm.vue';
import Register from './components/RegisterForm.vue';
import Dashboard from './components/personal-area/Dashboard.vue';

const Home = () => import('./components/personal-area/UserHome.vue');
const MyActivities = () => import('./components/personal-area/OwnActivities.vue');
const SavedActivities = () => import('./components/personal-area/Saved.vue');
const Settings = () => import('./components/personal-area/Settings.vue');
const HomePage = () => import('./components/HomePage.vue');
const AdminPage = () => import('./components/admin/adminPage.vue');
const FirstPage = () => import('./components/FirstPage.vue');

const requireAuth = (to, from, next) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        next({ path: '/login' });
    } else {
        next();
    }
};

const requireAdmin = (to, from, next) => {
    const role = localStorage.getItem('userRole');
    if (role === 'admin') {
        next();
    } else {
        next({ path: '/dashboard' });
    }
};

const redirectIfAuthenticated = (to, from, next) => {
    const role = localStorage.getItem('userRole'); // Usa 'userRole' per coerenza
    if (localStorage.getItem('authToken')) {
        if (role === 'admin') {
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
            name : 'FistPage',
        },
        {
            path: '/:index?',
            component: PageViewer,
            props: true,
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
            children: [
                {
                    path: '',
                    name: 'login-user',
                    component: Login,
                },
            ],
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
                const token = localStorage.getItem('authToken');
                const role = localStorage.getItem('userRole');
        
                if (!token) {
                    next({ path: '/login' });
                } else if (role !== 'user') {
                    next({ path: '/AdminBoard' });
                } else {
                    next();
                }
            },
            children: [
                {
                    path: '',
                    name: 'dashboard-home',
                    component: Home,
                },
                {
                    path: 'OwnActivities',
                    name: 'dashboard-activities',
                    component: MyActivities,
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
        }
    ],
});

export default router;