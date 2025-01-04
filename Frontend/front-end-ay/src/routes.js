import { createRouter, createWebHashHistory } from 'vue-router';
import PageViewer from './components/PageViewer.vue';
import CreateActivity from './components/CreateForm.vue';
import Login from './components/LoginForm.vue';
import Register from './components/RegisterForm.vue';
import Dashboard from './components/personal-area/Dashboard.vue';

const Home = () => import('./components/personal-area/UserHome.vue');
const MyActivities = () => import('./components/personal-area/OwnActivities.vue');
const SavedActivites = () => import('./components/personal-area/Saved.vue');
const Settings = () => import('./components/personal-area/Settings.vue');

const requireAuth = (to, from, next) => {
    if(!localStorage.getItem('authToken')){
        next({path: 'login'});
    }
    else{
        next();
    }
};

const redirectIfAuthenticated = (to, from, next) => {
    if(localStorage.getItem('authToken')){
        next({path: 'dashboard'});
    }
    else{
        next();
    }
}

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/:index?',
            component: PageViewer,
            props: true,
        },
        {
            path: '/createActivity',
            component: CreateActivity,
            name: 'createActivity',
            beforeEnter: requireAuth
        },
        {
            path: '/login',
            component: Login,
            name: 'login',
            beforeEnter: redirectIfAuthenticated,
            children: [
            {
                path: ''
            },
            {
                path: 'admin',
                name: 'login-admin',
                component: Login,
                props: { isAdmin: true }
            }
        ]
        },
        {
            path: '/register',
            component: Register,
            name: 'register',
            beforeEnter: redirectIfAuthenticated
        },
        {
            path: '/dashboard',
            component: Dashboard,
            name: 'dashboard',
            beforeEnter: requireAuth,
            children: [
                {
                    path: '',
                    name: 'dashboard-home',
                    component: Home
                },
                {
                    path: 'OwnActivities',
                    name: 'dashboard-activities',
                    component: MyActivities
                },
                {
                    path: 'Saved',
                    name: 'dashboard-saved',
                    component: SavedActivites
                },
                {
                    path: 'Settings',
                    name: 'dashboard-settings',
                    component: Settings
                }
            ]
        }
    ]
});

export default router;
