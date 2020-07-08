<template>
    <div class="data-list-component">
        <form>
            <div class="data-list-header">
                <h2 class="data-list-title">{{type}}</h2>
                <div class="checkbox checkbox-select-all">
                    <input type="checkbox" v-bind:name="`checkbox-all`">
                    <label v-bind:for="`checkbox-all`">Select All</label>
                </div>
            </div>
            <ul class="data-list">
                <li 
                    v-for="(datum, index) of data" 
                    v-bind:key="index"
                    class="data-list-entry"
                    @click="onDataListEntryClick(datum)"
                >
                    <div class="checkbox label-hidden">
                        <input type="checkbox" v-bind:name="`checkbox-${index}`">
                        <label v-bind:for="`checkbox-${index}`">Select Entry {{index}}</label>
                    </div>
                    {{ datum.name }}
                </li>
            </ul>
        </form>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    import Document from '@/models/document';
    import DocumentList from '@/models/document-list';
    import LISTS_VIEW_ACTION_TYPE from '@/views/lists/lists-view-action-type';
    import LISTS_VIEW_GETTER_TYPE from '../views/lists/lists-view-getter-type';

    @Component
    export default class DataList extends Vue {
        @Prop({required: true})
        public type: string;

        public data: Document[] | DocumentList[];

        public constructor() {
            super();
            this.data = [];
        }

        public async mounted() {
            if (this.type === 'DocumentList') {
                await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.READ_ALL_LISTS);
                this.data = this.$store.getters[LISTS_VIEW_GETTER_TYPE.GET_ALL_LISTS];
            }
            
        }

        public onDataListEntryClick(datum: Document[] | DocumentList[]) {
            this.$emit('dataListEntryClicked', datum);
        }
    }
</script>