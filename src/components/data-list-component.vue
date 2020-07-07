<template>
    <div class="data-list-component">
        <div class="data-list-header">{{type}}</div>
        <ul class="data-list">
            <li v-for="(datum, index) of data" v-bind:key="index">
                <a href="#" @click="onDataListEntryClick(datum)">{{ datum.name }}</a>
            </li>
        </ul>
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