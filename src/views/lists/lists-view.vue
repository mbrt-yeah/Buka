<template>
    <div class="view" id="document-lists-view-component">
        <ul class="view-submenu">
            <li v-for="list in lists" :key="list.id">
                <h5 class="list-title">
                <span class="text">{{list.name}}</span>
                <label-component :value="list.count" />
                </h5>
                <ul v-if="list.entries.length > 0" class="list-values">
                    <li v-for="(entry, index) in list.entries" :key="index" class="list-value">
                        <span class="text">{{entry.text}}</span>
                    </li>
                </ul>
            </li>
        </ul>
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

    @Component({
        components: {
            DocumentShelfComponent,
            LabelComponent
        }
    })
    export default class ListsView extends Vue {
        public lists: DocumentList[];

        public constructor() {
            super();

            const list1 = new DocumentList();
            list1.count = 123;
            list1.name = 'Customization List';

            const listValue1 = new DocumentListEntry();
            listValue1.text = 'A pretty cool book';

            const listValue2 = new DocumentListEntry();
            listValue2.text = 'Not a very good book';

            list1.entries.push(listValue1);
            list1.entries.push(listValue2);

            this.lists = [list1];
        }
    }
</script>

