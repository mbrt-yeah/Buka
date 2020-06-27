import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import MAIN_VIEW_ACTION_TYPE from '@/views/main/main-view-action-type';
import MAIN_VIEW_GETTER_TYPE from '@/views/main/main-view-getter-type';
import MAIN_VIEW_MUTATION_TYPE from '@/views/main/main-view-mutation-type';

@Module
export default class MainViewStoreModule extends VuexModule {
    public showSidebar: boolean = true;

    @Mutation
    public [MAIN_VIEW_MUTATION_TYPE.SET_SHOW_SIDEBAR](showSidebar: boolean) {
        this.showSidebar = showSidebar;
    }
}