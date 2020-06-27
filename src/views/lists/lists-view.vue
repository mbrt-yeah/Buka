<template>
    <div class="view" id="document-lists-view-component">
        <div class="view-submenu">
            <div class="view-submenu-header">
                <button type="button" class="button button-text button-icon-right" @click="onAddNewListClick">
                    <span class="iconmonstr iconmonstr-buka-plus"></span>
                    {{ $t('Add New List') }}
                </button>

                <form class="add-list-form" v-if="addNewListMode">
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
                <li v-for="list in lists" :key="list.id">
                    <span class="list-title">{{list.name}}</span>
                    <label-component class="list-count" :value="list.count" />
                </li>
            </ul>
        </div>
        <div class="view-content">
            <document-shelf-component
                v-bind:documents="$store.state.MainViewStoreModule.documents"
                v-bind:showDocumentPreview="true"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Document from '@/models/document';
    import DocumentList from '@/models/document-list';
    import DocumentListEntry from '@/models/document-list-entry';
    import DocumentShelfComponent from '@/components/document-shelf/document-shelf-component.vue';
    import Facet from '@/models/facet';
    import LabelComponent from '@/components/label-component.vue';
    import LISTS_VIEW_ACTION_TYPE from '@/views/lists/lists-view-action-type';
    import LISTS_VIEW_GETTER_TYPE from '@/views/lists/lists-view-getter-type';
    import SearchDropdownComponent from '@/components/search-dropdown-component.vue';

    @Component({
        components: {
            DocumentShelfComponent,
            LabelComponent,
            SearchDropdownComponent
        }
    })
    export default class ListsView extends Vue {
        public addNewListMode: boolean;
        public lists: DocumentList[];
        public listNewName: string;

        public constructor() {
            super();
            this.addNewListMode = false;
            this.listNewName = '';
            this.lists = [];
        }

        public mounted() {
            this.lists = this.$store.getters[LISTS_VIEW_GETTER_TYPE.GET_LISTS];
        }

        public onAddNewListClick() {
           this.addNewListMode = true;
        }

        public onCancelClick() {
            this.addNewListMode = false;
            this.listNewName = '';
        }

        public onSaveListClick() {
            this.addNewListMode = false;
            const list = new DocumentList();
            list.name = this.listNewName;
            this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.CREATE_LIST, list);
            this.listNewName = '';
        }
    }
</script>

