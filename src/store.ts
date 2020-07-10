import Vue from 'vue';
import Vuex from 'vuex';

import ListStoreModule from '@/store-modules/list/lists-store-module';
import LibraryStoreModule from '@/store-modules/library/library-store-module';
import MainStoreModule from '@/store-modules/main/main-store-module';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    modules: {
        LibraryStoreModule,
        ListStoreModule,
        MainStoreModule
    }
});

export default store;