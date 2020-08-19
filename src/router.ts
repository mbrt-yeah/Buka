import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';

import AddDocumentsView from '@/views/add-documents-view.vue';
import LibraryView from '@/views/library-view.vue';
import ListsView from '@/views/lists-view.vue';

const router: VueRouter = new VueRouter();

const routes = [
    {
        path: '/add-document',
        component: AddDocumentsView
    },
    {
        path: '/library',
        component: LibraryView
    },
    {
        path: '/lists',
        component: ListsView
    }
];

router.addRoutes(routes);

Vue.use(VueRouter);

export default router;