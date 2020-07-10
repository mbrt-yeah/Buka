import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import MAIN_STORE_MODULE_ACTION_TYPE from '@/store-modules/main/main-store-module-action-type';
import MAIN_STORE_MODULE_GETTER_TYPE from '@/store-modules/main/main-store-module-getter-type';
import MAIN_STORE_MODULE_MUTATION_TYPE from '@/store-modules/main/main-store-module-mutation-type';

@Module
export default class MainStoreModule extends VuexModule {
    public showSidebar: boolean = true;

    @Mutation
    public [MAIN_STORE_MODULE_MUTATION_TYPE.SIDEBAR_SET_SHOW](showSidebar: boolean) {
        this.showSidebar = showSidebar;
    }
}