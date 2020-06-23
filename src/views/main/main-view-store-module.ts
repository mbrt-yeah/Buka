import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import to from 'await-to-js';

import Document from '@/models/document';
import DocumentRepository from '@/repositories/document-repository';

import MAIN_VIEW_ACTION_TYPE from '@/views/main/main-view-action-type';
import MAIN_VIEW_GETTER_TYPE from '@/views/main/main-view-getter-type';
import MAIN_VIEW_MUTATION_TYPE from '@/views/main/main-view-mutation-type';

@Module
export default class MainViewStoreModule extends VuexModule {
    public documents: Document[];
    public showSidebar: boolean = true;

    @Mutation
    public [MAIN_VIEW_MUTATION_TYPE.SET_DOCUMENTS](documents: Document[]) {
        this.documents = documents;
    }

    @Mutation
    public [MAIN_VIEW_MUTATION_TYPE.SET_SHOW_SIDEBAR](showSidebar: boolean) {
        this.showSidebar = showSidebar;
    }

    @Action({ commit: MAIN_VIEW_MUTATION_TYPE.SET_DOCUMENTS })
    public async [MAIN_VIEW_ACTION_TYPE.READ_ALL_DOCUMENTS]() {
        const [readAllError, readAllResult] = await to<Document[]>( DocumentRepository.readAll() );

        if (readAllError) {
            throw readAllError;
        }

        if (!readAllResult) {
            return [];
        }

        return readAllResult;
    }
}