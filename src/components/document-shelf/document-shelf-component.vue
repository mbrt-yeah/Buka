<template>
    <div class="document-shelf-component">
        <div class="document-shelf-wrapper">
            <div class="document-shelf-options">
                <form class="sort-options">
                    <label class="label" for="sort-options">{{ $t('Sort by') }}</label>
                    <select id="sort-options" v-model="sortOptionselected" @change="onSortOptionChange">
                        <option v-for="(sortOption, index) in sortOptions" v-bind:value="sortOption" :key="index">{{ $t(`${sortOption}`) }}</option>
                    </select>
                </form>
                <ul class="display-options">
                    <li class="display-option" >
                        <button type="button" :class="['button button-small button-text', listDisplayOption === 'grid' ? 'active' : '']" @click="onListDisplayOptionClick('grid')">
                            <span class="iconmonstr iconmonstr-buka-grid"></span>
                            {{ $t('Grid') }}
                        </button>
                    </li>
                    <li class="display-option">
                        <button type="button" :class="['button button-small button-text', listDisplayOption === 'list' ? 'active' : '']" @click="onListDisplayOptionClick('list')">
                            <span class="iconmonstr iconmonstr-buka-list"></span>
                            {{ $t('List') }}
                        </button>
                    </li>
                </ul>
            </div>
            <ul :class="`document-shelf ${listDisplayOption}`">
                <li 
                    v-for="(document, index) in documents" 
                    :key="document.id" class="document" 
                    @click="onDocumentClick(index)"
                    :class="[(index === documentFocusedIndex) ? 'selected' : '']"
                >
                    <img :src="document.coverImage.getSrcAttributeValue()" :alt="`Cover Image of ${document.metadata.title}`" />
                    <ul class="metadata">
                        <li class="title" v-if="document.metadata.title">{{document.metadata.title}}</li>
                        <li class="description" v-if="document.metadata.description">{{document.metadata.description}}</li>
                        <li class="authors" v-if="document.metadata.authors && document.metadata.authors.length > 0">
                            <ul class="authors-list">
                                <li class="author" v-for="(author, index) in document.metadata.authors" :key="index">
                                    <span>{{author.firstname}} </span><span>{{author.middlename}} </span><span>{{author.surname}}</span>,&nbsp;
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <document-preview-component 
            v-if="showDocumentPreview" 
            v-bind:document="documents[documentFocusedIndex]"
            v-on:addToList:document="onDocumentAddToLists($event)"
            v-on:delete:document="onDocumentDelete($event, documentFocusedIndex)"
            v-on:update:document="onDocumentUpdate($event, documentFocusedIndex)"
        />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import uuid from 'short-uuid';

    import Configuration from '@/configuration';
    import Document from '@/models/document';
    import DocumentList from '@/models/document-list';

    import DOCUMENT_SHELF_COMPONENT_STORE_MODULE_ACTION_TYPE from '@/components/document-shelf/document-shelf-component-store-module-action-type';
    import DOCUMENT_SHELF_COMPONENT_STORE_MODULE_GETTER_TYPE from '@/components/document-shelf/document-shelf-component-store-module-getter-type';
    import DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE from '@/components/document-shelf/document-shelf-component-store-module-mutation-type';
    import DocumentPreviewComponent from '@/components/document-preview/document-preview-component.vue';
    import DocumentPreviewComponentEventAddToList from '@/components/document-preview/document-preview-component-event-add-to-list.ts';
    import DocumentShelfComponentEventDelete from '@/components/document-shelf/document-shelf-component-event-delete';
    import DocumentShelfComponentEventUpdate from '@/components/document-shelf/document-shelf-component-event-update';
    import DocumentShelfComponentStoreModule from '@/components/document-shelf/document-shelf-component-store-module';

    import LIST_DISPLAY_OPTION from '@/constants/list-display-option';

    import NotificationService from '@/services/notification-service';

    import LIST_STORE_MODULE_ACTION_TYPE from '@/store-modules/list/lists-store-module-action-type';

    @Component({
        components: {
            DocumentPreviewComponent
        }
    })
    export default class DocumentShelfComponent extends Vue {
        @Prop({required: true})
        public documents: Document[];

        @Prop({required: true, type: Boolean}) 
        public showDocumentPreview: boolean;

        public id: string;

        public documentFocusedIndex: number | null;
        public listDisplayOption: LIST_DISPLAY_OPTION;
        public sortOptions: string[];
        public sortOptionselected: string;

        public constructor() {
            super();

            this.id = (this.$parent.$options.name) ? `${this.$parent.$options.name}-${this.$options.name}` : `${uuid.generate}-${this.$options.name}`;

            if ( !this.$store.hasModule(this.id) ) {
                this.$store.registerModule(this.id, DocumentShelfComponentStoreModule);
            }

            this.$store.commit(DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE.DOCUMENT_SET_ALL, this.documents);
            this.$store.commit(DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE.LIST_SORT);

            this.documentFocusedIndex = null;
            this.listDisplayOption = this.$store.getters[DOCUMENT_SHELF_COMPONENT_STORE_MODULE_GETTER_TYPE.LIST_GET_DISPLAY_OPTION]
                || Configuration.instance().documentListDisplay.displayOptionDefault;

            this.sortOptions = Configuration.instance().documentSorting.sortOptions;
    
            this.sortOptionselected = this.$store.getters[DOCUMENT_SHELF_COMPONENT_STORE_MODULE_GETTER_TYPE.LIST_GET_SORT_OPTION_SELECTED]
                || Configuration.instance().documentSorting.sortOptionDefault;
        }

        public onListDisplayOptionClick(listDisplayOption: LIST_DISPLAY_OPTION): void {
            this.$store.commit(DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE.LIST_DISPLAY_OPTION_SET, listDisplayOption);
            this.listDisplayOption = listDisplayOption
        }

        public async onDocumentAddToLists(event: DocumentPreviewComponentEventAddToList): Promise<void> {
            const l = event.documentLists.length;

            if (!document || l  === 0) {
                return;
            }

            for (const documentList of event.documentLists) {
               documentList.documentIds.push(event.document.id);
            }

            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_UPDATE_MANY, event.documentLists);

            NotificationService.success(`Document &raquo;${event.document.metadata.title}&laquo; has been added to &raquo;${l}&laquo; lists.`);
        }

        public onDocumentClick(index: number): void {
            this.documentFocusedIndex = index;
        }

        public onDocumentDelete(document: Document, documentFocusedIndex: number): void {
            this.$emit('delete:document', new DocumentShelfComponentEventDelete(document, documentFocusedIndex));
        }

        @Watch('documents')
        public onDocumentsChange(): void {
            this.documentFocusedIndex = null;
        }

        public onSortOptionChange(): void {
            this.$store.commit(DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE.LIST_SET_SORT_OPTION_SELECTED, this.sortOptionselected);
            this.$store.commit(DOCUMENT_SHELF_COMPONENT_STORE_MODULE_MUTATION_TYPE.LIST_SORT);
        }

        public onDocumentUpdate(document: Document, documentFocusedIndex: number): void {
            this.$emit('update:document', new DocumentShelfComponentEventUpdate(document, documentFocusedIndex));
        }
    }
</script>

