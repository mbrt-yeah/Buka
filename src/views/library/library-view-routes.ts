import { RouteConfig } from 'vue-router';
import LibraryView from './library-view.vue';

const libraryViewRoutes: RouteConfig[] = [
    {
      path: '/library',
      name: 'library',
      component: LibraryView
    }
];

export default libraryViewRoutes;