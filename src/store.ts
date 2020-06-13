import Vue from 'vue';
import Vuex from 'vuex';

import BookListStoreModule from './componentz/book-list/book-list-store-module';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    modules: {
        BookListStoreModule
    }
});

export default store;