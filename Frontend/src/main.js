import {createApp} from 'vue';
import App from './App.vue';
import router from './routes';
import './style.css';
import $pages from './data';

const app = createApp(App);
app.use(router);

app.config.globalProperties.$pages = $pages;

app.mount('#app');