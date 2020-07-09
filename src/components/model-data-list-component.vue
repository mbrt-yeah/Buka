<template>
    <div class="model-data-list-component">
        <div class="data-list-header">
            <h2 class="data-list-title">{{title}}</h2>
            <div class="checkbox checkbox-select-all" v-if="data.length > 1">
                <input type="checkbox" value="selectAllData" name="`checkbox-all" id="checkbox-all" @change="onCheckboxAllClick" />
                <label for="checkbox-all">Select All</label>
            </div>
        </div>
        <template v-if="data.length > 0">
            <ul class="data-list">
                <li 
                    v-for="(datum, index) of data" 
                    v-bind:key="index"
                    class="data-list-entry"
                >
                    <div class="checkbox label-hidden">
                        <input 
                            type="checkbox"
                            v-bind:name="`checkbox-${index}`"
                            v-bind:checked="dataIdsSelected.indexOf(datum.id) !== -1 ? 'selected' : ''"
                            @change="onCheckboxClick($event, datum)"
                        />
                        <label v-bind:for="`checkbox-${index}`">Select Entry {{index}}</label>
                    </div>
                    <template v-if="model === 'Document'">{{ datum.metadata.title }}</template>
                    <template v-if="model === 'DocumentList'">{{ datum.name }}</template>
                </li>
            </ul>
            <div class="data-list-buttons">
                <button type="button" class="button button-small button-text button-positive" @click="onSaveClick">
                    <span class="iconmonstr iconmonstr-buka-save"></span>
                    {{ $t('Save') }}
                </button>
                <button type="button" class="button button-small button-text" @click="onCancelClick">
                    <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                    {{ $t('Cancel') }}
                </button>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    import Document from '@/models/document';
    import DocumentList from '@/models/document-list';
    import LISTS_VIEW_ACTION_TYPE from '@/views/lists/lists-view-action-type';
    import LISTS_VIEW_GETTER_TYPE from '../views/lists/lists-view-getter-type';

    import MAIN_STORE_ACTION_TYPE from '@/main-store/main-store-action-type';
    import MAIN_STORE_GETTER_TYPE from '@/main-store/main-store-getter-type';

    @Component
    export default class ModelDataList extends Vue {
        @Prop({required: true, type: String})
        public model: string;

        @Prop({required: true, type: String})
        public title: string;

        public data: Document[] | DocumentList[];
        public dataSelected: any[];
        public dataIdsSelected: string[];

        public constructor() {
            super();
            this.data = [];
            this.dataSelected = [];
            this.dataIdsSelected = [];
        }

        public async mounted() {
            if (this.model === 'DocumentList') {
                await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.READ_ALL_LISTS);
                this.data = this.$store.getters[LISTS_VIEW_GETTER_TYPE.GET_ALL_LISTS];
                return;
            }

            if (this.model === 'Document') {
                await this.$store.dispatch(MAIN_STORE_ACTION_TYPE.READ_ALL_DOCUMENTS);
                this.data = this.$store.getters[MAIN_STORE_GETTER_TYPE.GET_ALL_DOCUMENTS];
                return;
            }
        }

        public onCancelClick() {
            this.$emit('cancel');
        }

        public onCheckboxClick(event: any, datum: Document | DocumentList) {
            if (!event.target.checked) {
                const indexDataIdsSelected = this.dataIdsSelected.indexOf(datum.id);

                if (indexDataIdsSelected === -1) {
                    return;
                }

                this.dataIdsSelected.splice(indexDataIdsSelected, 1);
                this.dataSelected.splice(this.dataSelected.indexOf(datum), 1);

                return;
            }

            this.dataSelected.push(datum);
            this.dataIdsSelected.push(datum.id);
        }

        public onCheckboxAllClick(event: any) {
            this.dataSelected = [];
            this.dataIdsSelected = [];

            if (!event.target.checked) {
                return;
            }

            this.dataSelected = this.data;

            for (const datum of this.data) {
                this.dataIdsSelected.push(datum.id);
            }
        }

        public onSaveClick() {
            const dataSelected: Document[] | DocumentList[] = [];
            this.$emit('save', this.dataSelected);
        }
    }
</script>