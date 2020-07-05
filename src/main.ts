import 'reflect-metadata';
import allSettled from 'promise.allsettled';
import Vue from 'vue';
import Notifications from 'vue-notification';

import Database from '@/database';
import i18n from '@/i18n';
import MainView from '@/views/main/main-view.vue';
import router from '@/router';
import store from '@/store';

allSettled.shim();

Vue.use(Notifications);

Database.init().on('loaded', () => {
    const vueInstance = new Vue({
        i18n,
        router,
        store,
        render: h => h(MainView)
    });

    vueInstance.$mount('#app');
});