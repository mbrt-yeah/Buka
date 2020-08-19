import 'reflect-metadata';
import allSettled from 'promise.allsettled';
import Vue from 'vue';
import VueJsModal from 'vue-js-modal';
import VueNotifications from 'vue-notification';

import Database from '@/database';
import i18n from '@/localization';
import MainView from '@/views/main-view.vue';
import router from '@/router';
import store from '@/store';

allSettled.shim();

Vue.use(VueJsModal);

Vue.use(VueNotifications);

Database.init().on('loaded', () => {
    const vueInstance = new Vue({
        i18n,
        router,
        store,
        render: h => h(MainView)
    });

    vueInstance.$mount('#app');
});