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
                        <button type="button" class="button button-small button-text button-positive" @click="onListAddNewClickSave">
                            <span class="iconmonstr iconmonstr-buka-save"></span> {{ $t('Save') }}
                        </button>
                        <button type="button" class="button button-small button-text" @click="onListAddNewClickCancel">
                            <span class="iconmonstr iconmonstr-buka-x-mark"></span> {{ $t('Cancel') }}
                        </button>
                    </div>
                </form>
            </div>
            <ul class="document-lists">
                <li 
                    v-for="(list) of lists.values()" 
                    v-bind:key="list.id" 
                    v-bind:class="['document-list', (listFocused && list.id === listFocused.id) ? 'selected' : '']"
                >
                    <button type="button" class="button button-small button-text list-name" @click="onListNameClick(list)">{{ list.name }}</button>
                </li>
            </ul>
        </div>
        <div class="view-content" >
            <document-list-component
                v-if="listFocused"
                v-bind:list="listFocused"
                v-bind:key="listFocused.id"
                v-on:delete:list="onListDelete($event)"
                v-on:save:listname="onListNameSave($event)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    import DocumentListComponent from '@/components/document-list-component/document-list-component.vue';
    import DocumentListComponentEventDeleteList from '@/components/document-list-component/document-list-component-event-delete-list';
    import DocumentListComponentEventSaveListName from '@/components/document-list-component/document-list-component-event-save-list-name';

    import DocumentList from '@/models/document-list';

    import LIST_STORE_MODULE_ACTION_TYPE from '@/store-modules/list/lists-store-module-action-type';
    import LIST_STORE_MODULE_GETTER_TYPE from '@/store-modules/list/lists-store-module-getter-type';
    import LIST_STORE_MODULE_MUTATION_TYPE from '@/store-modules/list/lists-store-module-mutation-type';

    import NotifcationService from '@/services/notification-service';

    @Component({
        components: {
            DocumentListComponent
        }
    })
    export default class ListsView extends Vue {
        public addNewListMode: boolean;
        public listNewName: string;
        public listFocused: DocumentList | null;
        public lists: Map<string, DocumentList>;

        public constructor() {
            super();
            this.addNewListMode = false;
            this.listNewName = '';
            this.listFocused = null;
            this.lists = new Map();
        }

        public async beforeMount() {
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_READ_ALL);
            this.lists = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_GET_ALL];
        }

        public onListAddNewClick(): void {
           this.addNewListMode = true;
        }

        public onListAddNewClickCancel(): void {
            this.addNewListMode = false;
            this.listNewName = '';
        }

        public async onListAddNewClickSave(): Promise<void> {
            const list = new DocumentList();
            list.name = this.listNewName;
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_CREATE_ONE, list);

            this.addNewListMode = false;
            this.listNewName = '';
            this.lists = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_GET_ALL];

            NotifcationService.success(`List with name &raquo;${list.name}&laquo; created`);
        }

        public async onListDelete(event: DocumentListComponentEventDeleteList): Promise<void> {
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_DELETE_ONE, event.list);
            this.listFocused = null;
            this.lists = this.$store.getters[LIST_STORE_MODULE_GETTER_TYPE.LIST_GET_ALL];

            NotifcationService.success(`List with name &raquo;${event.list.name}&laquo; deleted`);
        }

        public async onListNameClick(list: DocumentList): Promise<void> {
            if (this.listFocused && list.id === this.listFocused.id) {
                return;
            }

            this.listFocused = list;
        }

        public async onListNameSave(event: DocumentListComponentEventSaveListName): Promise<void> {
            if (!this.listFocused) {
                return;
            }

            this.listFocused.name = event.value;
            await this.$store.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_UPDATE_ONE, this.listFocused);
        }
    }
</script>

