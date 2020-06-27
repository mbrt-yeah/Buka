<template>
    <div class="view" id="document-library-view-component">
        <div class="view-submenu">
            <div class="view-submenu-header" v-if="facetValuesSelected.length > 0">
                <ul class="facet-values-selected">
                    <li class="facet-value-selected" v-for="(facetValue, index) of facetValuesSelected" :key="facetValue.name">
                        <span class="facet-value-selected-text">{{facetValue.facetName}}: {{facetValue.name}}</span>
                        <button type="button" class="button button-x-small button-text button-icon-only" @click="onRemoveSelectedFacetValueClick(index)">
                            <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                            <span class="text">{{ $t('Delete Selected Facet Value') }}</span>
                        </button>
                    </li>
                </ul>
            </div>
            <ul class="facets">
                <li v-for="facet in facets" :key="facet.name" class="facet">
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
                v-bind:documents="documents"
                v-bind:showDocumentPreview="true"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Document from '@/models/document';
    import DocumentShelfComponent from '@/components/document-shelf/document-shelf-component.vue';
    import Facet from '@/models/facet';
    import FacetValue from '@/models/facet-value';
    import LabelComponent from '@/components/label-component.vue';
    import LIBRARY_VIEW_ACTION_TYPE from '@/views/library/library-view-action-type';
    import LIBRARY_VIEW_GETTER_TYPE from '@/views/library/library-view-getter-type';
    import LIBRARY_VIEW_MUTATION_TYPE from '@/views/library/library-view-mutation-type';

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
        public updateCounter: number;

        public constructor() {
            super();
            this.documents = [];
            this.facets = [];
            this.facetValuesSelected = [];
        }

        public async mounted(): Promise<void> {
            await this.$store.dispatch(LIBRARY_VIEW_ACTION_TYPE.READ_ALL_DOCUMENTS);
            this.documents = this.$store.getters[LIBRARY_VIEW_GETTER_TYPE.GET_ALL_DOCUMENTS];
            this.facets = this.$store.getters[LIBRARY_VIEW_GETTER_TYPE.GET_ALL_FACETS];
            this.facetValuesSelected = this.$store.getters[LIBRARY_VIEW_GETTER_TYPE.GET_ALL_FACET_VALUES_SELECTED];
        }

        public async onRemoveSelectedFacetValueClick(index: number): Promise<void> {
            this.$store.commit(LIBRARY_VIEW_MUTATION_TYPE.REMOVE_FACET_VALUE_SELECTED, index);
            await this.$store.dispatch(LIBRARY_VIEW_ACTION_TYPE.READ_ALL_DOCUMENTS);
            this.documents = this.$store.getters[LIBRARY_VIEW_GETTER_TYPE.GET_ALL_DOCUMENTS];
            this.facets = this.$store.getters[LIBRARY_VIEW_GETTER_TYPE.GET_ALL_FACETS];
        }

        public async onFacetValueClick(facetValue: FacetValue): Promise<void> {
            this.$store.commit(LIBRARY_VIEW_MUTATION_TYPE.ADD_FACET_VALUE_SELECTED, facetValue);
            await this.$store.dispatch(LIBRARY_VIEW_ACTION_TYPE.READ_ALL_DOCUMENTS);
            this.documents = this.$store.getters[LIBRARY_VIEW_GETTER_TYPE.GET_ALL_DOCUMENTS];
            this.facets = this.$store.getters[LIBRARY_VIEW_GETTER_TYPE.GET_ALL_FACETS];
        }
    }
</script>

