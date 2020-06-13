import Vue from 'vue';
import VueRouter from 'vue-router';

import bookListRoutes from './componentz/book-list/book-list-routes';

const router: VueRouter = new VueRouter();
router.addRoutes(bookListRoutes);

Vue.use(VueRouter);

export default router;