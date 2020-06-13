import Vue from 'vue';
import appComponent from './componentz/app/app-component.vue';
import router from './router';
import store from './store';

const vueInstance = new Vue({
    router,
    store,
    render: h => h(appComponent)
});

vueInstance.$mount('#app');