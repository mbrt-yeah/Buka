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
                        v-bind:isStandalone="true"
                        v-bind:label="$t('List Name')"
                        v-bind:name="`list-name-${listFocusedIndex}`"
                        v-bind:showEditButton="true"
                        v-bind:showDeleteButton="false"
                        v-bind:value="lists[listFocusedIndex].name"
                        v-on:save="onListNameChangeSave(listFocusedIndex, $event)"
                        v-on:valuechange="onListNameChange(listFocusedIndex, $event)"
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
    import EditableTextfield from '@/components/editable-textfield.vue';
    import EditableTextfieldChangeEvent from '@/components/editable-textfield-change-event.vue';
    import LabelComponent from '@/components/label-component.vue';
    import ModelDataList from '@/components/model-data-list-component.vue';
    import SearchDropdownComponent from '@/components/search-dropdown-component.vue';

    import LISTS_VIEW_ACTION_TYPE from '@/views/lists/lists-view-action-type';
    import LISTS_VIEW_GETTER_TYPE from '@/views/lists/lists-view-getter-type';
    import LISTS_VIEW_MUTATION_TYPE from '@/views/lists/lists-view-mutation-type';

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
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.READ_ALL_LISTS);
            this.lists = this.$store.getters[LISTS_VIEW_GETTER_TYPE.GET_ALL_LISTS];
        }

        public onAddDocuments(): void {
            this.$modal.show('data-list-documents');
        }

        public async onAddDocumentsSave(documents: Document[]): Promise<void> {
            if (documents.length === 0) {
                return;
            }

            this.$modal.hide('data-list-documents');
        }

        public onAddDocumentsCancel(): void {
            this.$modal.hide('data-list-documents');
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
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.DELETE_LIST, index);
            this.listFocusedIndex = -1;
            NotifcationService.success(`List with name &raquo;${listToDelete.name}&laquo; deleted`);
        }

        public async onListNameChange(index: number, event: EditableTextfieldChangeEvent): Promise<void> {
            this.lists[index].name = event.value;
        }

        public async onListNameChangeSave(index: number, event: EditableTextfieldChangeEvent): Promise<void> {
            const listToUpdate = this.lists[index].clone();
            listToUpdate.name = event.value;

            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.UPDATE_LIST, listToUpdate);

            NotifcationService.success(`List name updated`);
        }

        public async onListNameClick(index: number, event: string): Promise<void> {
            this.$store.commit(LISTS_VIEW_MUTATION_TYPE.SET_LIST_FOCUSED_INDEX, index);
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.READ_ALL_LIST_DOCUMENTS, index);

            this.listFocusedDocuments = this.$store.getters[LISTS_VIEW_GETTER_TYPE.GET_LIST_FOCUSED_DOCUMENTS];
            this.listFocusedIndex = this.$store.getters[LISTS_VIEW_GETTER_TYPE.GET_LIST_FOCUSED_INDEX];
        }

        public async onListNewSaveClick(): Promise<void> {
            const list = new DocumentList();
            list.name = this.listNewName;
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.CREATE_LIST, list);

            this.addNewListMode = false;
            this.listNewName = '';

            NotifcationService.success(`List with name &raquo;${list.name}&laquo; created`);
        }
    }
</script>

