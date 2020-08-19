<template>
    <div class="document-list-component">
        <div class="view-content-header" v-if="list">
            <editable-textfield
                v-bind:customClasses="'list-name'"
                v-bind:hideLabel="true"
                v-bind:isEditMode="false"
                v-bind:label="$t('List Name')"
                v-bind:name="`list-name-${list.id}`"
                v-bind:showEditButton="true"
                v-bind:showDeleteButton="false"
                v-bind:value="list.name"
                v-on:save:value="onListNameChangeSave($event)"
                v-on:update:value="onListNameChange($event)"
            />

            <div class="button-group">
                <button type="button" class="button button-small button-text button-icon-right" @click="onDocumentsAddToList">
                    <span class="iconmonstr iconmonstr-buka-plus"></span>
                    <span class="text">{{ $t('Add Documents') }}</span>
                </button>

                <delete-something 
                    v-bind:deleteButtonText="'Delete List'"
                    v-bind:deleteButtonConfirmText="'Yes, Delete List'"
                    v-bind:deleteButtonCancelText="'No, Cancel'"
                    v-bind:deleteConfirmationQuestion="'Are you sure?'"
                    v-on:deleteconfirmed="onListDelete"
                />
                
            </div>
        </div>
        <document-shelf-component
            v-if="listDocuments.length > 0"
            v-bind:documents="listDocuments"
            v-bind:showDocumentPreview="true"
            v-on:delete:document="onDocumentDelete($event)"
            v-on:update:document="onDocumentUpdate($event)"
        />
        <modal name="data-list-documents">
            <model-data-list-component
                v-bind:model="'Document'"
                v-bind:title="'Documents'"
                v-on:confirm="onDocumentsAddToListSave"
                v-on:cancel="onDocumentsAddToListCancel"
            />
        </modal>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    
    import Document from '@/models/document';
    import DocumentList from '@/models/document-list';
    import Facet from '@/models/facet';

    import DeleteSomething from '@/components/delete-something-component.vue';
    import DocumentListComponentEventDeleteList from '@/components/document-list-component/document-list-component-event-delete-list';
    import DocumentListComponentEventSaveListName from '@/components/document-list-component/document-list-component-event-save-list-name';
    import DocumentShelfComponent from '@/components/document-shelf/document-shelf-component.vue';
    import DocumentShelfComponentEventDelete from '@/components/document-shelf/document-shelf-component-event-delete';
    import DocumentShelfComponentEventUpdate from '@/components/document-shelf/document-shelf-component-event-update';
    import EditableTextfield from '@/components/editable-textfield/editable-textfield-component.vue';
    import EditableTextFieldComponentEventChange from '@/components/editable-textfield/editable-textfield-component-event-change.ts';
    import LabelComponent from '@/components/label-component.vue';
    import ModelDataListComponent from '@/components/model-data-list-component/model-data-list-component.vue';
    import ModelDataListComponentEventCancel from '@/components/model-data-list-component/model-data-list-component-event-cancel.ts';
    import ModelDataListComponentEventConfirm from '@/components/model-data-list-component/model-data-list-component-event-confirm.ts';
    import SearchDropdownComponent from '@/components/search-dropdown-component.vue';

    import LIBRARY_STORE_MODULE_ACTION_TYPE from '@/store-modules/library/library-store-module-action-type';
    import LIBRARY_STORE_MODULE_GETTER_TYPE from '@/store-modules/library/library-store-module-getter-type';
    import LIBRARY_STORE_MODULE_MUTATION_TYPE from '@/store-modules/library/library-store-module-mutation-type';

    import LIST_STORE_MODULE_ACTION_TYPE from '@/store-modules/list/lists-store-module-action-type';
    import LIST_STORE_MODULE_GETTER_TYPE from '@/store-modules/list/lists-store-module-getter-type';
    import LIST_STORE_MODULE_MUTATION_TYPE from '@/store-modules/list/lists-store-module-mutation-type';

    import NotifcationService from '@/services/notification-service';

    @Component({
        components: {
            DeleteSomething,
            DocumentShelfComponent,
            EditableTextfield,
            LabelComponent,
            ModelDataListComponent,
            SearchDropdownComponent
        }
    })
    export default class DocumentListComponent extends Vue {
        @Prop({required: true, type: DocumentList})
        public list: DocumentList;

        public id: number;
        public listDocuments: Document[];

        public constructor() {
            super();
            this.id = 0;
            this.listDocuments = [];
        }

        public rerender() {
            this.id++;
        }

        public async beforeMount(): Promise<void> {
            this.$store.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_FOCUSED_SET, this.list);
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_FOCUSED_READ_ALL_DOCUMENTS);
            this.listDocuments = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS];
        }

        public async onDocumentDelete(event: DocumentShelfComponentEventDelete) {
            await this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_DELETE_ONE, event.document);
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_FOCUSED_READ_ALL_DOCUMENTS, this.list);
            this.listDocuments = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS];

            NotifcationService.success(`Document deleted`);
        }

        public async onDocumentUpdate(event: DocumentShelfComponentEventUpdate) {
            await this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_UPDATE_ONE, event.document);
            this.listDocuments = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS];
            NotifcationService.success(`Document updated`);
        }

        public onDocumentsAddToList(): void {
            this.$modal.show('data-list-documents');
        }

        public onDocumentsAddToListCancel(event: ModelDataListComponentEventCancel): void {
            this.$modal.hide('data-list-documents');
        }

        public async onDocumentsAddToListSave(event: ModelDataListComponentEventConfirm): Promise<void> {
            this.$modal.hide('data-list-documents');

            const documents: Document[] = event.data as Document[];

            if (documents.length === 0) {
                return;
            }

            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_FOCUSED_ADD_DOCUMENTS, documents);
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_FOCUSED_READ_ALL_DOCUMENTS, this.list);
            this.listDocuments = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS];

            NotifcationService.success(`${documents.length} documents have been added to list &raquo;${this.list.name}&laquo;.`);
        }

        public async onListDelete(): Promise<void> {
            const event = new DocumentListComponentEventDeleteList(this.list);
            this.$emit(DocumentListComponentEventDeleteList.id, event);
        }

        public async onListNameChange(event: EditableTextFieldComponentEventChange): Promise<void> {
            this.list.name = event.value + '';
        }

        public async onListNameChangeSave(eventIncoming: EditableTextFieldComponentEventChange): Promise<void> {
            const eventOutgoing = new DocumentListComponentEventSaveListName(eventIncoming.value + '');
            this.$emit(DocumentListComponentEventSaveListName.id, eventOutgoing);
        }
    }
</script>