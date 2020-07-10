import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import to from 'await-to-js';

import Document from '@/models/document';
import DocumentRepository from '@/repositories/document-repository';

import DocumentList from '@/models/document-list';
import DocumentListRepository from '@/repositories/document-list-repository';

import LIST_STORE_MODULE_ACTION_TYPE from '@/store-modules/list/lists-store-module-action-type';
import LIST_STORE_MODULE_GETTER_TYPE from '@/store-modules/list/lists-store-module-getter-type';
import LIST_STORE_MODULE_MUTATION_TYPE from '@/store-modules/list/lists-store-module-mutation-type';

@Module
export default class ListStoreModule extends VuexModule {
    public listFocusedDocuments: Document[] = [];
    public listFocusedIndex: number = -1;
    public lists: DocumentList[] = [];

    get [LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS](): Document[] {
        return this.listFocusedDocuments;
    }

    get [LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_INDEX](): number {
        return this.listFocusedIndex;
    }

    get [LIST_STORE_MODULE_GETTER_TYPE.LIST_GET_ALL](): DocumentList[] {
        return this.lists;
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_ADD_ONE](documentList: DocumentList): void {
        this.lists.push(documentList);
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_REMOVE_ONE](index: number): void {
        if ( index < 0 || index >= this.lists.length ) {
            return;
        }

        this.lists.splice(index, 1);
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_ONE](documentListNew: DocumentList): void {
        let i = 0;
        const l = this.lists.length;

        for (i; i < l; i++) {
            if (this.lists[i].id === documentListNew.id) {
                continue;
            }

            this.lists[i] = documentListNew;
            break;
        }
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_ALL](documentLists: DocumentList[]): void {
        this.lists = documentLists;
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_FOCUSED_SET_DOCUMENTS](listFocusedDocuments: Document[]): void {
        this.listFocusedDocuments = listFocusedDocuments;
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_FOCUSED_SET_INDEX](listFocusedIndex: number): void {
        this.listFocusedIndex = listFocusedIndex;
    }

    @Action
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_CREATE_ONE](documentList: DocumentList): Promise<DocumentList> {
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

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_ADD_ONE, createResult);

        return createResult;
    }

    @Action
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_DELETE_ONE](index: number): Promise<DocumentList> {
        const listToDelete = this.lists[index];

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

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_REMOVE_ONE, index);

        return deleteResult;
    }

    @Action
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_READ_ALL](): Promise<DocumentList[]> {
        const [readAllError, readAllResult] = await to<DocumentList[]>( DocumentListRepository.readAll() );

        if (readAllError) {
            throw readAllError;
        }

        if (!readAllResult) {
            return [];
        }

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_ALL, readAllResult);

        return readAllResult;
    }

    @Action
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_READ_ALL_DOCUMENTS](documentListIndex: number): Promise<Document[]> {
        const documentList = this.lists[documentListIndex];

        if (!documentList) {
            throw new Error(`[ListViewStoreModule] No document list at index position ${documentListIndex} found`);
        }

        const [readAllError, readAllResult] = await to<Document[]>( DocumentRepository.readMany(documentList.documentIds) );

        if (readAllError) {
            throw readAllError;
        }

        if (!readAllResult) {
            return [];
        }

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_FOCUSED_SET_DOCUMENTS, readAllResult);

        return readAllResult;
    }

    @Action
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_UPDATE_ONE](documentListUpdated: DocumentList): Promise<DocumentList> {
        const [updateError, updateResult] = await to<DocumentList>( DocumentListRepository.update(documentListUpdated) );

        if (updateError) {
            throw updateError;
        }

        if (!updateResult) {
            throw new Error('updateResult is undefined');
        }

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_ONE, updateResult);

        return updateResult;
    }

    @Action
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_UPDATE_MANY](documentListsUpdated: DocumentList[]): Promise<DocumentList[]> {
        const [updateError, updateResult] = await to<DocumentList[]>( DocumentListRepository.updateMany(documentListsUpdated) );

        if (updateError) {
            throw updateError;
        }

        if (!updateResult) {
            throw new Error('updateResult is undefined');
        }

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_ALL, updateResult);

        return updateResult;
    }
}