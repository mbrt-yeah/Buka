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
    public listFocused: DocumentList;
    public listFocusedDocuments: Document[] = [];
    public listFocusedIndex: number = -1;
    public lists: Map<string, DocumentList> = new Map();

    get [LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET](): DocumentList {
        return this.listFocused;
    }

    get [LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS](): Document[] {
        return this.listFocusedDocuments;
    }

    get [LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_INDEX](): number {
        return this.listFocusedIndex;
    }

    get [LIST_STORE_MODULE_GETTER_TYPE.LIST_GET_ALL](): Map<string, DocumentList> {
        return this.lists;
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_ALL](documentLists: DocumentList[]): void {
        for (const documentList of documentLists) {
            this.lists.set(documentList.id, documentList);
        }
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_MANY](documentLists: DocumentList[]): void {
        for (const documentList of documentLists) {
            this.lists.set(documentList.id, documentList);
        }
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_ONE](documentList: DocumentList): void {
        console.log(documentList);
        this.lists.set(documentList.id, documentList);
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_UNSET_ONE](listToRemove: DocumentList): void {
        this.lists.delete(listToRemove.id);
    }

    @Mutation
    public [LIST_STORE_MODULE_MUTATION_TYPE.LIST_FOCUSED_SET](listFocused: DocumentList): void {
        this.listFocused = listFocused;
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

        const [createError, createResult] = await to<DocumentList>( DocumentListRepository.createOne(documentList) );

        if (createError) {
            throw createError;
        }

        if (!createResult) {
            throw new Error('createResult is undefined');
        }

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_ONE, createResult);

        return createResult;
    }

    @Action
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_DELETE_ONE](parameter: string | DocumentList): Promise<DocumentList> {
        const [deleteError, deleteResult] = await to<DocumentList>( DocumentListRepository.delete(parameter) );

        if (deleteError) {
            throw deleteError;
        }

        if (!deleteResult) {
            throw new Error('deleteResult is undefined');
        }

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_UNSET_ONE, deleteResult);

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
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_READ_ONE](listId: string): Promise<DocumentList> {
        const [readError, readResult] = await to<DocumentList | undefined>( DocumentListRepository.read(listId) );

        if (readError) {
            throw readError;
        }

        if (!readResult) {
            throw new Error(`No list with id ${listId} found.`);
        }

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_FOCUSED_SET, readResult);

        return readResult;
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

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_SET_MANY, updateResult);

        return updateResult;
    }

    @Action
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_FOCUSED_ADD_DOCUMENTS](documentsToAdd: Document[]): Promise<void> {
        if (!this.listFocused) {
            throw new Error('no list to which to add documents');
        }

        if (documentsToAdd.length === 0) {
            return;
        }

        const documentIds: string[] = [];

        for (const document of documentsToAdd) {
            documentIds.push(document.id);
        }

        const documentIdsAdded = this.listFocused.addDocumentIds(documentIds);

        if (documentIdsAdded === 0) {
            return;
        }

        await this.context.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_UPDATE_ONE, this.listFocused);
    }

    @Action
    public async [LIST_STORE_MODULE_ACTION_TYPE.LIST_FOCUSED_READ_ALL_DOCUMENTS](): Promise<Document[]> {
        if (!this.listFocused) {
            throw new Error('no list for which to read all documents');
        }

        if (this.listFocused.documentIds.length === 0) {
            this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_FOCUSED_SET_DOCUMENTS, []);
            return [];
        }

        const [readAllError, readAllResult] = await to<Document[]>( DocumentRepository.readMany(this.listFocused.documentIds) );

        if (readAllError) {
            throw readAllError;
        }

        if (!readAllResult) {
            return [];
        }

        this.context.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_FOCUSED_SET_DOCUMENTS, readAllResult);

        return readAllResult;
    }
}