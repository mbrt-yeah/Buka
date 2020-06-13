import { RouteConfig } from 'vue-router';
import BookListComponent from './book-list-component.vue';

const bookListRoutes: RouteConfig[] = [
    {
      path: '/',
      name: 'book-list',
      component: BookListComponent
    }
];

export default bookListRoutes;