import { createRouter, createWebHashHistory } from 'vue-router';
import PageViewer from './components/PageViewer.vue';
import CreateActivity from './components/CreateForm.vue';
import Login from './components/LoginForm.vue';
import Register from './components/RegisterForm.vue';
import Dashboard from './components/personalArea.vue';

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
            beforeEnter: (to, from, next) =>{
                if(!localStorage.getItem('authToken')){
                    next({path: 'login'});
                }
                else{

                    next();
                }
            }
        },
        {
            path: '/login',
            component: Login,
            name: 'login',
            beforeEnter: (to, from, next) =>{
                if (localStorage.getItem('authToken')) {
                    next({ path: 'dashboard' });
                } else {
                    next();
                }
            }
        },
        {
            path: '/register',
            component: Register,
            name: 'register',
            beforeEnter: (to, from, next) =>{
                if (localStorage.getItem('authToken')) {
                    next({ path: 'dashboard' });
                } else {
                    next();
                }
            }
        },
        {
            path: '/dashboard',
            component: Dashboard,
            name: 'dashboard',
            beforeEnter: (to, from, next) =>{
                if (!localStorage.getItem('authToken')) {
                    next({ path: 'login' });
                } else {
                    next();
                }
            }
        }
    ],
});

export default router;
