<template>
    <div class="view" id="document-lists-view-component">
        <div class="view-submenu">
            <div class="view-submenu-header">
                <button v-if="!addNewListMode" type="button" class="button button-text button-icon-right" @click="onAddNewListClick">
                    <span class="iconmonstr iconmonstr-buka-plus"></span>
                    {{ $t('Add New List') }}
                </button>

                <form v-if="addNewListMode" class="add-list-form" >
                    <input type="text" :placeholder="$t('Insert List Title')" v-model="listNewName" />
                    <div class="add-list-form-buttons">
                        <button type="button" class="button button-small button-text button-positive" @click="onSaveListClick">
                            <span class="iconmonstr iconmonstr-buka-save"></span> {{ $t('Save') }}
                        </button>
                        <button type="button" class="button button-small button-text" @click="onCancelClick">
                            <span class="iconmonstr iconmonstr-buka-x-mark"></span> {{ $t('Cancel') }}
                        </button>
                    </div>
                </form>
            </div>
            <ul class="document-lists">
                <li v-for="(list, index) of lists" :key="list._id" class="document-list">
                    <editable-textfield
                        v-bind:customClasses="'buka'"
                        v-bind:hideLabel="true"
                        v-bind:isStandalone="true"
                        v-bind:label="$t('List Name')"
                        v-bind:name="`list-name-${index}`"
                        v-bind:value="list.name"
                        v-bind:displayValueAs="`button`"
                        v-on:displayedValueClick="onClick(index, $event)"
                        v-on:change="onChange(index, $event)"
                        v-on:delete="onDelete(index, list)"
                    />
                </li>
            </ul>
        </div>
        <div class="view-content">
            <!--
            <document-shelf-component
                v-bind:documents="$store.state.MainViewStoreModule.documents"
                v-bind:showDocumentPreview="true"
            />
            -->
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
        public lists: DocumentList[];
        public listNewName: string;
        public isEditMode: boolean;

        public constructor() {
            super();
            this.addNewListMode = false;
            this.isEditMode = false;
            this.listNewName = '';
            this.lists = [];
        }

        public async mounted() {
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.READ_ALL_LISTS);
            this.lists = this.$store.getters[LISTS_VIEW_GETTER_TYPE.GET_ALL_LISTS];
        }

        public onAddNewListClick() {
           this.addNewListMode = true;
        }

        public onCancelClick() {
            this.addNewListMode = false;
            this.listNewName = '';
        }

        public async onChange(index: number, event: EditableTextfieldChangeEvent) {
            const listToUpdate = this.lists[index].clone();
            listToUpdate.name = event.value;
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.UPDATE_LIST, listToUpdate);

            NotifcationService.success(`List Updated`);
        }

        public async onClick(index: number, event: string) {
            console.log(index);
            console.log(event);
        }

        public async onDelete(index: number, list: DocumentList) {
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.DELETE_LIST, index);

            NotifcationService.success(`List with name &raquo;${list.name}&laquo; deleted`);
        }

        public onListNameClick(list: DocumentList) {
            console.log(list);
        }

        public async onSaveListClick() {
            const list = new DocumentList();
            list.name = this.listNewName;
            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.CREATE_LIST, list);

            this.addNewListMode = false;
            this.listNewName = '';

            NotifcationService.success(`List with name &raquo;${list.name}&laquo; created`);
        }
    }
</script>

