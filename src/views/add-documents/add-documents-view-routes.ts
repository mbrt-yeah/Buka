import { RouteConfig } from 'vue-router';
import ADdDocumentsView from './add-documents-view.vue';

const addDocumentsViewRoutes: RouteConfig[] = [
    {
      path: '/add-document',
      name: 'add-document',
      component: ADdDocumentsView
    }
];

export default addDocumentsViewRoutes;