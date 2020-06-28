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

    get [LISTS_VIEW_GETTER_TYPE.GET_ALL_LISTS](): DocumentList[] {
        return this._documentLists;
    }

    @Mutation
    public [LISTS_VIEW_MUTATION_TYPE.ADD_LIST](documentList: DocumentList) {
        this._documentLists.push(documentList);
    }

    @Mutation
    public [LISTS_VIEW_MUTATION_TYPE.REMOVE_LIST](index: number) {
        if ( index < 0 || index >= this._documentLists.length ) {
            return;
        }

        this._documentLists.splice(index, 1);
    }

    @Mutation
    public [LISTS_VIEW_MUTATION_TYPE.SET_LISTS](documentLists: DocumentList[]) {
        this._documentLists = documentLists;
    }

    @Action
    public async [LISTS_VIEW_ACTION_TYPE.CREATE_LIST](documentList: DocumentList) {
        if (!documentList.name) {
            return;
        }

        const [createError, createResult] = await to<DocumentList>( DocumentListRepository.create(documentList) );

        if (createError) {
            throw createError;
        }

        if (!createResult) {
            return [];
        }

        this.context.commit(LISTS_VIEW_MUTATION_TYPE.ADD_LIST, createResult);

        return createResult;
    }

    @Action
    public async [LISTS_VIEW_ACTION_TYPE.DELETE_LIST](index: number) {
        const listToDelete = this._documentLists[index];

        if (!listToDelete) {
            return;
        }

        const [deleteError, deleteResult] = await to<number>( DocumentListRepository.delete(listToDelete._id) );

        if (deleteError) {
            throw deleteError;
        }

        if (deleteResult === undefined) {
            return;
        }

        this.context.commit(LISTS_VIEW_MUTATION_TYPE.REMOVE_LIST, index);

        return deleteResult;
    }

    @Action
    public async [LISTS_VIEW_ACTION_TYPE.READ_ALL_LISTS]() {
        const [readAllError, readAllResult] = await to<DocumentList[]>( DocumentListRepository.readAll() );

        if (readAllError) {
            throw readAllError;
        }

        if (!readAllResult) {
            return [];
        }

        this.context.commit(LISTS_VIEW_MUTATION_TYPE.SET_LISTS, readAllResult);

        return readAllResult;
    }
}