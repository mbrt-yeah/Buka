import Vue from 'vue';
import Vuex from 'vuex';

import LibraryViewStoreModule from '@/views/library/library-view-store-module';
import ListsViewStoreModule from '@/views/lists/lists-view-store-module';
import MainViewStoreModule from '@/views/main/main-view-store-module';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    modules: {
        LibraryViewStoreModule,
        ListsViewStoreModule,
        MainViewStoreModule
    }
});

export default store;