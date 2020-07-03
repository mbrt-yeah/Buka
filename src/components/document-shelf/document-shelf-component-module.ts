import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import arraySort from 'array-sort';

import Configuration from '@/configuration';
import Document from '@/models/document';
import DOCUMENT_SHELF_COMPONENT_GETTER_TYPE from '@/components/document-shelf/document-shelf-component-getter-type';
import DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE from '@/components/document-shelf/document-shelf-component-mutation-type';
import LIST_DISPLAY_OPTION from '@/constants/list-display-option';

@Module
export default class DocumentShelfComponentStoreModule extends VuexModule {
    public documentListDisplayOption: LIST_DISPLAY_OPTION = Configuration.instance().documentListDisplay.displayOptionDefault;
    public documents: Document[] = [];
    public documentsSortOptionSelected: string = Configuration.instance().documentSorting.sortOptionDefault;;

    get [DOCUMENT_SHELF_COMPONENT_GETTER_TYPE.GET_DOCUMENT_LIST_DISPLAY_OPTION](): LIST_DISPLAY_OPTION {
        return this.documentListDisplayOption;
    }

    get [DOCUMENT_SHELF_COMPONENT_GETTER_TYPE.GET_DOCUMENTS](): Document[] {
        return this.documents;
    }

    get [DOCUMENT_SHELF_COMPONENT_GETTER_TYPE.GET_DOCUMENTS_SORT_OPTION_SELECTED](): string {
        return this.documentsSortOptionSelected;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENT_LIST_DISPLAY_OPTION](documentListDisplayOption: LIST_DISPLAY_OPTION) {
        this.documentListDisplayOption = documentListDisplayOption;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENTS](documents: Document[]) {
        this.documents = documents;
    }


    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENTS_SORT_OPTION_SELECTED](documentsSortOptionSelected: string) {
        this.documentsSortOptionSelected = documentsSortOptionSelected;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SORT_DOCUMENTS]() {
        const [field, direction] = this.documentsSortOptionSelected.split('_');

        this.documents = arraySort<Document>(this.documents, `metadata.${field}`, {
            reverse: (direction === 'desc') ? true : false
        });
    }
}