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
    public [LISTS_VIEW_MUTATION_TYPE.ADD_LIST](documentList: DocumentList): void {
        this._documentLists.push(documentList);
    }

    @Mutation
    public [LISTS_VIEW_MUTATION_TYPE.REMOVE_LIST](index: number): void {
        if ( index < 0 || index >= this._documentLists.length ) {
            return;
        }

        this._documentLists.splice(index, 1);
    }

    @Mutation
    public [LISTS_VIEW_MUTATION_TYPE.SET_LIST](documentListNew: DocumentList): void {
        let i = 0;
        const l = this._documentLists.length;

        for (i; i < l; i++) {
            if (this._documentLists[i]._id === documentListNew._id) {
                continue;
            }

            this._documentLists[i] = documentListNew;
            break;
        }
    }

    @Mutation
    public [LISTS_VIEW_MUTATION_TYPE.SET_LISTS](documentLists: DocumentList[]): void {
        this._documentLists = documentLists;
    }

    @Action
    public async [LISTS_VIEW_ACTION_TYPE.CREATE_LIST](documentList: DocumentList): Promise<DocumentList> {
        if (!documentList.name) {
            throw new Error('dcumentList to be created has no name');
        }

        const [createError, createResult] = await to<DocumentList>( DocumentListRepository.create(documentList) );

        if (createError) {
            throw createError;
        }

        if (!createResult) {
            throw new Error('createResult is undefined');
        }

        this.context.commit(LISTS_VIEW_MUTATION_TYPE.ADD_LIST, createResult);

        return createResult;
    }

    @Action
    public async [LISTS_VIEW_ACTION_TYPE.DELETE_LIST](index: number): Promise<DocumentList> {
        const listToDelete = this._documentLists[index];

        if (!listToDelete) {
            throw new Error('No list to delete found');
        }

        const [deleteError, deleteResult] = await to<DocumentList>( DocumentListRepository.delete(listToDelete) );

        if (deleteError) {
            throw deleteError;
        }

        if (!deleteResult) {
            throw new Error('deleteResult is undefined');
        }

        this.context.commit(LISTS_VIEW_MUTATION_TYPE.REMOVE_LIST, index);

        return deleteResult;
    }

    @Action
    public async [LISTS_VIEW_ACTION_TYPE.READ_ALL_LISTS](): Promise<DocumentList[]> {
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

    @Action
    public async [LISTS_VIEW_ACTION_TYPE.UPDATE_LIST](documentList: DocumentList): Promise<DocumentList> {
        const [updateError, updateResult] = await to<DocumentList>( DocumentListRepository.update(documentList) );

        if (updateError) {
            throw updateError;
        }

        if (!updateResult) {
            throw new Error('updateResult is undefined');
        }

        this.context.commit(LISTS_VIEW_MUTATION_TYPE.SET_LIST, documentList);

        return updateResult;
    }
}