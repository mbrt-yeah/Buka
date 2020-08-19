import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import arraySort from 'array-sort';

import Configuration from '@/configuration';
import Document from '@/models/document';
import DOCUMENT_SHELF_COMPONENT_STORE_MODULE_ACTION_TYPE from '@/components/document-shelf/document-shelf-component-store-module-action-type';
import DOCUMENT_SHELF_COMPONENT_STORE_MODULE_GETTER_TYPE from '@/components/document-shelf/document-shelf-component-store-module-getter-type';
import DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE from '@/components/document-shelf/document-shelf-component-store-module-mutation-type';
import LIST_DISPLAY_OPTION from '@/constants/list-display-option';

@Module
export default class DocumentShelfComponentStoreModule extends VuexModule {
    public documentListDisplayOption: LIST_DISPLAY_OPTION = Configuration.instance().documentListDisplay.displayOptionDefault;
    public documents: Document[] = [];
    public documentsSortOptionSelected: string = Configuration.instance().documentSorting.sortOptionDefault;;

    /*
    get [DOCUMENT_SHELF_COMPONENT_STORE_MODULE_GETTER_TYPE.DOCUMENT_GET_ALL](): Document[] {
        return this.documents;
    }*/

    get [DOCUMENT_SHELF_COMPONENT_STORE_MODULE_GETTER_TYPE.LIST_GET_DISPLAY_OPTION](): LIST_DISPLAY_OPTION {
        return this.documentListDisplayOption;
    }

    get [DOCUMENT_SHELF_COMPONENT_STORE_MODULE_GETTER_TYPE.LIST_GET_SORT_OPTION_SELECTED](): string {
        return this.documentsSortOptionSelected;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE.DOCUMENT_SET_ALL](documents: Document[]) {
        this.documents = documents;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE.LIST_DISPLAY_OPTION_SET](documentListDisplayOption: LIST_DISPLAY_OPTION) {
        this.documentListDisplayOption = documentListDisplayOption;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE.LIST_SET_SORT_OPTION_SELECTED](documentsSortOptionSelected: string) {
        this.documentsSortOptionSelected = documentsSortOptionSelected;
    }

    @Mutation
    public [DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE.LIST_SORT]() {
        const [field, direction] = this.documentsSortOptionSelected.split('_');

        this.documents = arraySort<Document>(this.documents, `metadata.${field}`, {
            reverse: (direction === 'desc') ? true : false
        });
    }
}