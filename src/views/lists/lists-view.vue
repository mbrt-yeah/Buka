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
                    v-bind:class="['document-list', (index === listFocusedIndex) ? 'selected' : '']">
                    <editable-textfield
                        v-bind:customClasses="'buka'"
                        v-bind:hideLabel="true"
                        v-bind:isStandalone="true"
                        v-bind:label="$t('List Name')"
                        v-bind:name="`list-name-${index}`"
                        v-bind:value="list.name"
                        v-bind:displayValueAs="`button`"
                        v-on:displayedValueClick="onListNameClick(index, $event)"
                        v-on:change="onListNameChange(index, $event)"
                        v-on:delete="onListDelete(index, list)"
                    />
                </li>
            </ul>
        </div>
        <div class="view-content" >
            <template v-if="listFocusedIndex >= 0">
                <h2 class="list-name">{{lists[listFocusedIndex].name}}</h2>
                <document-shelf-component
                    v-bind:documents="listFocusedDocuments"
                    v-bind:showDocumentPreview="true"
                />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Document from '@/models/document';
    import DocumentList from '@/models/document-list';
    import DocumentListEntry from '@/models/document-list-entry';
    import DocumentShelfComponent from '@/components/document-shelf/document-shelf-component.vue';
    import EditableTextfield from '@/components/editable-textfield.vue';
    import EditableTextfieldChangeEvent from '@/components/editable-textfield-change-event.vue';
    import Facet from '@/models/facet';
    import LabelComponent from '@/components/label-component.vue';
    import LISTS_VIEW_ACTION_TYPE from '@/views/lists/lists-view-action-type';
    import LISTS_VIEW_GETTER_TYPE from '@/views/lists/lists-view-getter-type';
    import NotifcationService from '@/services/notification-service';
    import SearchDropdownComponent from '@/components/search-dropdown-component.vue';
import LISTS_VIEW_MUTATION_TYPE from './lists-view-mutation-type';

    @Component({
        components: {
            DocumentShelfComponent,
            EditableTextfield,
            LabelComponent,
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

        public onListAddNewClick() {
           this.addNewListMode = true;
        }

        public onListAddNewCancelClick() {
            this.addNewListMode = false;
            this.listNewName = '';
        }

        public async onListDelete(index: number, list: DocumentList) {
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.DELETE_LIST, index);
            this.listFocusedIndex = -1;

            NotifcationService.success(`List with name &raquo;${list.name}&laquo; deleted`);
        }

        public async onListNameChange(index: number, event: EditableTextfieldChangeEvent) {
            const listToUpdate = this.lists[index].clone();
            listToUpdate.name = event.value;
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.UPDATE_LIST, listToUpdate);

            NotifcationService.success(`List Updated`);
        }

        public async onListNameClick(index: number, event: string) {
            this.$store.commit(LISTS_VIEW_MUTATION_TYPE.SET_LIST_FOCUSED_INDEX, index);
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.READ_ALL_LIST_DOCUMENTS, index);

            this.listFocusedDocuments = this.$store.getters[LISTS_VIEW_GETTER_TYPE.GET_LIST_FOCUSED_DOCUMENTS];
            this.listFocusedIndex = this.$store.getters[LISTS_VIEW_GETTER_TYPE.GET_LIST_FOCUSED_INDEX];
        }

        public async onListNewSaveClick() {
            const list = new DocumentList();
            list.name = this.listNewName;
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.CREATE_LIST, list);

            this.addNewListMode = false;
            this.listNewName = '';

            NotifcationService.success(`List with name &raquo;${list.name}&laquo; created`);
        }
    }
</script>

