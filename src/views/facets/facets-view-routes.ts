import { RouteConfig } from 'vue-router';
import FacetsView from './facets-view.vue';

const facetsViewRoutes: RouteConfig[] = [
    {
      path: '/facets',
      name: 'facets',
      component: FacetsView
    }
];

export default facetsViewRoutes;