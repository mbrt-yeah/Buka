<template>
    <div class="view" id="document-lists-view-component">
        <div class="view-submenu">
            <div class="view-submenu-header">
                <button v-if="!addNewListMode" type="button" class="button button-text button-icon-right" @click="onListAddNewClick">
                    <span class="iconmonstr iconmonstr-buka-plus"></span>
                    {{ $t('Add New List') }}
                </button>

                <form v-if="addNewListMode" class="add-list-form" >
                    <input type="text" :placeholder="$t('Insert List Title')" v-model="listNewName" />
                    <div class="add-list-form-buttons">
                        <button type="button" class="button button-small button-text button-positive" @click="onListNewSaveClick">
                            <span class="iconmonstr iconmonstr-buka-save"></span> {{ $t('Save') }}
                        </button>
                        <button type="button" class="button button-small button-text" @click="onListAddNewCancelClick">
                            <span class="iconmonstr iconmonstr-buka-x-mark"></span> {{ $t('Cancel') }}
                        </button>
                    </div>
                </form>
            </div>
            <ul class="document-lists">
                <li 
                    v-for="(list, index) of lists" 
                    v-bind:key="list.id" 
                    v-bind:class="['document-list', (index === listFocusedIndex) ? 'selected' : '']"
                >
                    <button type="button" class="button button-small button-text list-name" @click="onListNameClick(index, $event)">{{ list.name }}</button>
                </li>
            </ul>
        </div>
        <div class="view-content" >
            <template v-if="listFocusedIndex >= 0">
                <div class="view-content-header">
                    <editable-textfield
                        v-bind:customClasses="'list-name'"
                        v-bind:hideLabel="true"
                        v-bind:isEditMode="false"
                        v-bind:label="$t('List Name')"
                        v-bind:name="`list-name-${listFocusedIndex}`"
                        v-bind:showEditButton="true"
                        v-bind:showDeleteButton="false"
                        v-bind:value="lists[listFocusedIndex].name"
                        v-on:save:value="onListNameChangeSave(listFocusedIndex, $event)"
                        v-on:update:value="onListNameChange(listFocusedIndex, $event)"
                    />

                    <div class="button-group">
                        <button type="button" class="button button-small button-text button-icon-right" @click="onAddDocuments">
                            <span class="iconmonstr iconmonstr-buka-plus"></span>
                            <span class="text">{{ $t('Add Documents') }}</span>
                        </button>

                        <delete-something 
                            v-bind:deleteButtonText="'Delete List'"
                            v-bind:deleteButtonConfirmText="'Yes, Delete List'"
                            v-bind:deleteButtonCancelText="'No, Cancel'"
                            v-bind:deleteConfirmationQuestion="'Are you sure?'"
                            v-on:deleteconfirmed="onListDelete(listFocusedIndex)"
                        />
                        
                    </div>
                </div>
                <document-shelf-component
                    v-if="listFocusedDocuments.length > 0"
                    v-bind:documents="listFocusedDocuments"
                    v-bind:showDocumentPreview="true"
                    v-on:delete:document="onDocumentDelete($event)"
                    v-on:update:document="onDocumentUpdate($event)"
                />
            </template>
        </div>
        <modal name="data-list-documents">
            <model-data-list 
                v-bind:model="'Document'"
                v-bind:title="'Documents'"
                v-on:save="onAddDocumentsSave"
                v-on:cancel="onAddDocumentsCancel" 
            />
        </modal>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    import Document from '@/models/document';
    import DocumentList from '@/models/document-list';
    import Facet from '@/models/facet';

    import DeleteSomething from '@/components/delete-something-component.vue';
    import DocumentShelfComponent from '@/components/document-shelf/document-shelf-component.vue';
    import DocumentShelfComponentEventDelete from '@/components/document-shelf/document-shelf-component-event-delete';
    import DocumentShelfComponentEventUpdate from '@/components/document-shelf/document-shelf-component-event-update';
    import EditableTextfield from '@/components/editable-textfield/editable-textfield-component.vue';
    import EditableTextFieldComponentEventChange from '@/components/editable-textfield/editable-textfield-component-event-change.ts';
    import LabelComponent from '@/components/label-component.vue';
    import ModelDataList from '@/components/model-data-list-component.vue';
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
            ModelDataList,
            SearchDropdownComponent
        }
    })
    export default class ListsView extends Vue {
        public addNewListMode: boolean;
        public isEditMode: boolean;
        public listFocusedDocuments: Document[];
        public listFocusedIndex: number;
        public listNewName: string;
        public lists: DocumentList[];

        public constructor() {
            super();
            this.addNewListMode = false;
            this.isEditMode = false;
            this.listFocusedDocuments = [];
            this.listFocusedIndex = -1;
            this.listNewName = '';
            this.lists = [];
        }

        public async mounted() {
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_READ_ALL);
            this.lists = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_GET_ALL];
        }

        public onAddDocuments(): void {
            this.$modal.show('data-list-documents');
        }

        public async onAddDocumentsSave(documents: Document[]): Promise<void> {
            this.$modal.hide('data-list-documents');

            const l = documents.length;
            const listFocused = this.lists[this.listFocusedIndex];

            if (!listFocused || l  === 0) {
                return;
            }

            const documentIds: string[] = [];

            for (const document of documents) {
                documentIds.push(document.id);
            }

            const documentIdsAdded = listFocused.addDocumentIds(documentIds);

            if (documentIdsAdded === 0) {
                return;
            }

            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_UPDATE_ONE, listFocused);
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_READ_ALL_DOCUMENTS, this.listFocusedIndex);
            this.listFocusedDocuments = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS];

            NotifcationService.success(`${documentIdsAdded} documents have been added to list &raquo;${listFocused.name}&laquo;.`);
        }

        public onAddDocumentsCancel(): void {
            this.$modal.hide('data-list-documents');
        }

        public async onDocumentDelete(event: DocumentShelfComponentEventDelete) {
            await this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_DELETE_ONE, event.document);

            NotifcationService.success(`Document deleted`);

            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_READ_ALL_DOCUMENTS, this.listFocusedIndex);
            this.listFocusedDocuments = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS];
        }

        public async onDocumentUpdate(event: DocumentShelfComponentEventUpdate) {
            await this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_UPDATE_ONE, event.document);

            NotifcationService.success(`Document updated`);

            this.listFocusedDocuments = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS];
        }

        public onListAddNewClick(): void {
           this.addNewListMode = true;
        }

        public onListAddNewCancelClick(): void {
            this.addNewListMode = false;
            this.listNewName = '';
        }

        public async onListDelete(index: number): Promise<void> {
            const listToDelete = this.lists[index];
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_DELETE_ONE, index);
            this.listFocusedIndex = -1;
            NotifcationService.success(`List with name &raquo;${listToDelete.name}&laquo; deleted`);
        }

        public async onListNameChange(index: number, event: EditableTextFieldComponentEventChange): Promise<void> {
            this.lists[index].name = event.value + '';
        }

        public async onListNameChangeSave(index: number, event: EditableTextFieldComponentEventChange): Promise<void> {
            const listToUpdate = this.lists[index].clone();
            listToUpdate.name = event.value + '';

            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_UPDATE_ONE, listToUpdate);

            NotifcationService.success(`List name updated`);
        }

        public async onListNameClick(index: number, event: string): Promise<void> {
            this.$store.commit(LIST_STORE_MODULE_MUTATION_TYPE.LIST_FOCUSED_SET_INDEX, index);
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_READ_ALL_DOCUMENTS, index);

            this.listFocusedDocuments = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_ALL_DOCUMENTS];
            this.listFocusedIndex = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_FOCUSED_GET_INDEX];
        }

        public async onListNewSaveClick(): Promise<void> {
            const list = new DocumentList();
            list.name = this.listNewName;
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_CREATE_ONE, list);

            this.addNewListMode = false;
            this.listNewName = '';

            NotifcationService.success(`List with name &raquo;${list.name}&laquo; created`);
        }
    }
</script>

