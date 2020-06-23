import Vue from 'vue';
import Vuex from 'vuex';

import MainViewStoreModule from '@/views/main/main-view-store-module';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    modules: {
        MainViewStoreModule
    }
});

export default store;