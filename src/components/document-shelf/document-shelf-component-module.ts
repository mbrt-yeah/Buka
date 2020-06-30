import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import arraySort from 'array-sort';

import Document from '@/models/document';
import DOCUMENT_SHELF_COMPONENT_GETTER_TYPE from '@/components/document-shelf/document-shelf-component-getter-type';
import DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE from '@/components/document-shelf/document-shelf-component-mutation-type';
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
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SORT_DOCUMENTS](sortOption: string) {
        if (!sortOption) {
            return;
        }

        const [field, direction] = sortOption.split('_');

        this.documents = arraySort<Document>(this.documents, `metadata.${field}`, {
            reverse: (direction === 'desc') ? true : false
        });
    }
}