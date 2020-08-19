<template>
    <div class="view" id="document-library-view-component">
        <div class="view-submenu">
            <div class="view-submenu-header" v-if="facetValuesSelected.length > 0">
                <ul class="facet-values-selected">
                    <li class="facet-value-selected" v-for="(facetValue, index) of facetValuesSelected" :key="facetValue.name">
                        <span class="facet-value-selected-text">{{facetValue.facetName}}: {{facetValue.name}}</span>
                        <button type="button" class="button button-x-small button-text button-icon-only" @click="onFacetValueRemoveClick(index)">
                            <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                            <span class="text">{{ $t('Delete Selected Facet Value') }}</span>
                        </button>
                    </li>
                </ul>
            </div>
            <ul class="facets">
                <li v-for="facet in facets" :key="facet.name" v-show="facet.valuesTotal() > 0" class="facet">
                    <span class="facet-name">{{ $t(facet.name) }}</span>
                    <ul class="facet-values">
                        <li v-for="(facetValue, key) in facet.values" :key="key" class="facet-value">
                            <button type="button" class="button button-small button-text facet-value-name" @click="onFacetValueClick(facetValue)">{{ facetValue.name }}</button>
                            <label-component class="facet-value-count" :value="facetValue.count" />
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="view-content">
            <document-shelf-component
                v-if="documents.length > 0"
                v-bind:documents="documents"
                v-bind:showDocumentPreview="true"
                v-on:delete:document="onDocumentDelete($event)"
                v-on:update:document="onDocumentUpdate($event)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import to from 'await-to-js';

    import Document from '@/models/document';
    import Facet from '@/models/facet';
    import FacetValue from '@/models/facet-value';

    import DocumentShelfComponent from '@/components/document-shelf/document-shelf-component.vue';
    import DocumentShelfComponentEventDelete from '@/components/document-shelf/document-shelf-component-event-delete';
    import DocumentShelfComponentEventUpdate from '@/components/document-shelf/document-shelf-component-event-update';
    import LabelComponent from '@/components/label-component.vue';

    import NotificationService from '@/services/notification-service';

    import LIBRARY_STORE_MODULE_ACTION_TYPE from '@/store-modules/library/library-store-module-action-type';
    import LIBRARY_STORE_MODULE_GETTER_TYPE from '@/store-modules/library/library-store-module-getter-type';
    import LIBRARY_STORE_MODULE_MUTATION_TYPE from '@/store-modules/library/library-store-module-mutation-type';

    @Component({
        components: {
            DocumentShelfComponent,
            LabelComponent
        }
    })
    export default class LibraryView extends Vue {
        public documents: Document[];
        public facets: Facet[];
        public facetValuesSelected: FacetValue[];

        public constructor() {
            super();
            this.documents = [];
            this.facets = [];
            this.facetValuesSelected = [];
        }

        public async mounted(): Promise<void> {
            const [dispatchError, documents] = await to<Document[]>( this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_READ_ALL) );

            if (dispatchError) {
                throw dispatchError;
            }

            if (!documents) {
                throw new Error('documents undefined');
            }

            this.documents = documents;

            this.facets = this.$store.getters[LIBRARY_STORE_MODULE_GETTER_TYPE.FACET_GET_ALL];
            this.facetValuesSelected = this.$store.getters[LIBRARY_STORE_MODULE_GETTER_TYPE.FACET_VALUE_SELECTED_GET_ALL];
        }

        public async onDocumentDelete(event: DocumentShelfComponentEventDelete) {
            await this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_DELETE_ONE, event.document);

            NotificationService.success(`Document deleted`);

            this.documents = this.$store.getters[LIBRARY_STORE_MODULE_GETTER_TYPE.DOCUMENT_GET_ALL];
            this.facets = this.$store.getters[LIBRARY_STORE_MODULE_GETTER_TYPE.FACET_GET_ALL];
        }

        public async onDocumentUpdate(event: DocumentShelfComponentEventUpdate) {
            await this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_UPDATE_ONE, event.document);

            NotificationService.success(`Document updated`);

            this.documents = this.$store.getters[LIBRARY_STORE_MODULE_GETTER_TYPE.DOCUMENT_GET_ALL];
            this.facets = this.$store.getters[LIBRARY_STORE_MODULE_GETTER_TYPE.FACET_GET_ALL];
        }

        public async onFacetValueClick(facetValue: FacetValue): Promise<void> {
            this.$store.commit(LIBRARY_STORE_MODULE_MUTATION_TYPE.FACET_VALUE_ADD_SELECTED, facetValue);

            const [dispatchError, documents] = await to<Document[]>( this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_READ_ALL) );

            if (dispatchError) {
                throw dispatchError;
            }

            if (!documents) {
                throw new Error('documents undefined');
            }

            this.documents = documents;
            this.facets = this.$store.getters[LIBRARY_STORE_MODULE_GETTER_TYPE.FACET_GET_ALL];
        }

        public async onFacetValueRemoveClick(index: number): Promise<void> {
            this.$store.commit(LIBRARY_STORE_MODULE_MUTATION_TYPE.FACET_VALUE_REMOVE_SELECTED, index);

            const [dispatchError, documents] = await to<Document[]>( this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_READ_ALL) );

            if (dispatchError) {
                throw dispatchError;
            }

            if (!documents) {
                throw new Error('documents undefined');
            }

            this.documents = documents;
            this.facets = this.$store.getters[LIBRARY_STORE_MODULE_GETTER_TYPE.FACET_GET_ALL];
        }
    }
</script>

