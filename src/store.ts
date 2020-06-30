import Vue from 'vue';
import Vuex from 'vuex';

import ListsViewStoreModule from '@/views/lists/lists-view-store-module';
import MainStoreModule from '@/main-store/main-store-module';
import MainViewStoreModule from '@/views/main/main-view-store-module';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    modules: {
        ListsViewStoreModule,
        MainStoreModule,
        MainViewStoreModule
    }
});

export default store;