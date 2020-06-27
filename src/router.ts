import Vue from 'vue';
import VueRouter from 'vue-router';

import addDocumentsViewRoutes from '@/views/add-documents/add-documents-view-routes';
import libraryViewRoutes from '@/views/library/library-view-routes';
import listsViewRoutes from '@/views/lists/lists-view-routes';

const router: VueRouter = new VueRouter();
router.addRoutes(addDocumentsViewRoutes);
router.addRoutes(libraryViewRoutes);
router.addRoutes(listsViewRoutes);

Vue.use(VueRouter);

export default router;