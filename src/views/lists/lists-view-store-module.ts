import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import to from 'await-to-js';

import DocumentList from '@/models/document-list';
import DocumentListRepository from '@/repositories/document-list-repository';

import LISTS_VIEW_ACTION_TYPE from '@/views/lists/lists-view-action-type';
import LISTS_VIEW_GETTER_TYPE from '@/views/lists/lists-view-getter-type';
import LISTS_VIEW_MUTATION_TYPE from '@/views/lists/lists-view-mutation-type';

@Module
export default class ListsViewStoreModule extends VuexModule {
    public _documentLists: DocumentList[] = [];

    get [LISTS_VIEW_GETTER_TYPE.GET_LISTS](): DocumentList[] {
        return this._documentLists;
    }

    @Mutation
    public [LISTS_VIEW_MUTATION_TYPE.ADD_LIST](documentList: DocumentList) {
        this._documentLists.push(documentList);
    }

    @Mutation
    public [LISTS_VIEW_MUTATION_TYPE.SET_LISTS](documentLists: DocumentList[]) {
        this._documentLists = documentLists;
    }

    @Action({ commit: LISTS_VIEW_MUTATION_TYPE.ADD_LIST })
    public async [LISTS_VIEW_ACTION_TYPE.CREATE_LIST](documentList: DocumentList) {
        const [createError, createResult] = await to<DocumentList>( DocumentListRepository.create(documentList) );

        if (createError) {
            throw createError;
        }

        if (!createResult) {
            return [];
        }

        return createResult;
    }

    @Action({ commit: LISTS_VIEW_MUTATION_TYPE.SET_LISTS })
    public async [LISTS_VIEW_ACTION_TYPE.READ_ALL_LISTS]() {
        const [readAllError, readAllResult] = await to<DocumentList[]>( DocumentListRepository.readAll() );

        if (readAllError) {
            throw readAllError;
        }

        if (!readAllResult) {
            return [];
        }

        return readAllResult;
    }
}