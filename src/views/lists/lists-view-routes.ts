import { RouteConfig } from 'vue-router';
import ListsView from './lists-view.vue';

const listsViewRoutes: RouteConfig[] = [
    {
      path: '/lists',
      name: 'lists',
      component: ListsView
    }
];

export default listsViewRoutes;