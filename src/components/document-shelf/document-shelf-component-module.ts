import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import arraySort from 'array-sort';
import to from 'await-to-js';

import Document from '@/models/document';
import DOCUMENT_SHELF_COMPONENT_ACTION_TYPE from '@/components/document-shelf/document-shelf-component-action-type';
import DOCUMENT_SHELF_COMPONENT_GETTER_TYPE from '@/components/document-shelf/document-shelf-component-getter-type';
import DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE from '@/components/document-shelf/document-shelf-component-mutation-type';
import DocumentRepository from '@/repositories/document-repository';
import LIST_DISPLAY_OPTION from '@/constants/list-display-option';

@Module
export default class DocumentShelfComponentStoreModule extends VuexModule {
    public documents: Document[] = [];
    public documentFocusedIndex: number;
    public documentListDisplayOption: LIST_DISPLAY_OPTION;
    public documentSortOptionSelected: string;

    get [DOCUMENT_SHELF_COMPONENT_GETTER_TYPE.DOCUMENTS_TOTAL](): number {
        return this.documents.length;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.NOOP]() {return;}

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENT_FOCUSED_INDEX](documentFocusedIndex: number) {
        this.documentFocusedIndex = documentFocusedIndex;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENT_LIST_DISPLAY_OPTION](documentListDisplayOption: LIST_DISPLAY_OPTION) {
        this.documentListDisplayOption = documentListDisplayOption;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENT_SORT_OPTION_SELECTED](documentSortOptionSelected: string) {
        this.documentSortOptionSelected = documentSortOptionSelected;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENTS](documents: Document[]) {
        this.documents = documents;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SORT_DOCUMENTS](sortOption: string) {
        if (!sortOption) {
            return;
        }

        const [field, direction] = sortOption.split('_');

        this.documents = arraySort<Document>(this.documents, `metadata.${field}`, {
            reverse: (direction === 'desc') ? true : false
        });
    }

    @Action
    public async [DOCUMENT_SHELF_COMPONENT_ACTION_TYPE.DELETE_DOCUMENT](documentToDelete: Document) {
        const [deleteError, deleteResult] = await to<number>( DocumentRepository.delete(documentToDelete.id) );

        if (deleteError) {
            // TODO figure out what to do here
            throw deleteError;
        }

        if (deleteResult === undefined) {
            // TODO figure out what to do here
            throw new Error('deleteResult undefined');
        }

        const documentsNew = this.documents.filter((document: Document) => {
            return document.id !== documentToDelete.id;
        });

        this.context.commit(DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENTS, documentsNew);

        return deleteResult;
    }

    @Action({ commit: DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.NOOP })
    public async [DOCUMENT_SHELF_COMPONENT_ACTION_TYPE.UPDATE_DOCUMENT](document: Document): Promise<number> {
        const [updateError, updateResult] = await to<number>( DocumentRepository.update(document) );

        if (updateError) {
            // TODO figure out what to do here
            throw updateError;
        }

        if (!updateResult) {
            // TODO figure out what to do here
            throw new Error('updateResult undefined');
        }

        return updateResult;
    }
}