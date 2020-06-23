import Vue from 'vue';
import VueRouter from 'vue-router';

import addDocumentsViewRoutes from '@/views/add-documents/add-documents-view-routes';
import facetsViewRoutes from '@/views/facets/facets-view-routes';
import listsViewRoutes from '@/views/lists/lists-view-routes';

const router: VueRouter = new VueRouter();
router.addRoutes(addDocumentsViewRoutes);
router.addRoutes(facetsViewRoutes);
router.addRoutes(listsViewRoutes);

Vue.use(VueRouter);

export default router;