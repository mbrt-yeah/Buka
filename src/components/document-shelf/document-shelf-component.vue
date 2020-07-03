<template>
    <div class="document-shelf-component">
        <div class="document-shelf-wrapper">
            <div class="document-shelf-options">
                <form class="sort-options">
                    <label class="label" for="sort-options">{{ $t('Sort by') }}</label>
                    <select id="sort-options" v-model="documentsSortOptionSelected" @change="onDocumentsSortOptionChange">
                        <option v-for="(documentsSortOption, index) in documentsSortOptions" v-bind:value="documentsSortOption" :key="index">{{ $t(`${documentsSortOption}`) }}</option>
                    </select>
                </form>
                <ul class="display-options">
                    <li class="display-option" >
                        <button type="button" :class="['button button-small button-text', documentListDisplayOption === 'grid' ? 'active' : '']" @click="onDocumentListDisplayOptionClick('grid')">
                            <span class="iconmonstr iconmonstr-buka-grid"></span>
                            {{ $t('Grid') }}
                        </button>
                    </li>
                    <li class="display-option">
                        <button type="button" :class="['button button-small button-text', documentListDisplayOption === 'list' ? 'active' : '']" @click="onDocumentListDisplayOptionClick('list')">
                            <span class="iconmonstr iconmonstr-buka-list"></span>
                            {{ $t('List') }}
                        </button>
                    </li>
                </ul>
            </div>
            <ul :class="`document-shelf ${documentListDisplayOption}`">
                <li 
                    v-for="(document, index) in documents" 
                    :key="document.id" class="document" 
                    @click="onDocumentClick(index)"
                    :class="[(index === documentFocusedIndex) ? 'selected' : '']"
                >
                    <img :src="document.coverImage.getSrcAttributeValue()" :alt="`Cover Image of ${document.metadata.title}`" />
                    <ul class="metadata">
                        <li class="title" v-if="document.metadata.title">{{document.metadata.title}}</li>
                        <li class="description" v-if="document.metadata.description">{{document.metadata.description}}</li>
                        <li class="authors" v-if="document.metadata.authors && document.metadata.authors.length > 0">
                            <ul class="authors-list">
                                <li class="author" v-for="(author, index) in document.metadata.authors" :key="index">
                                    <span>{{author.firstname}} </span><span>{{author.middlename}} </span><span>{{author.surname}}</span>,&nbsp;
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <document-preview-component 
            v-if="showDocumentPreview" 
            v-bind:document="documents[documentFocusedIndex]"
            v-on:documentDelete="onDocumentDelete([documentFocusedIndex, $event])"
            v-on:documentUpdate="onDocumentUpdate([documentFocusedIndex, $event])"
        />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import uuid from 'short-uuid';

    import Configuration from '@/configuration';
    import Document from '@/models/document';
    import DOCUMENT_SHELF_COMPONENT_ACTION_TYPE from '@/components/document-shelf/document-shelf-component-action-type';
    import DOCUMENT_SHELF_COMPONENT_GETTER_TYPE from '@/components/document-shelf/document-shelf-component-getter-type';
    import DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE from '@/components/document-shelf/document-shelf-component-mutation-type';
    import DocumentPreviewComponent from '@/components/document-preview-component.vue';
    import DocumentShelfComponentStoreModule from '@/components/document-shelf/document-shelf-component-module';
    import LIST_DISPLAY_OPTION from '@/constants/list-display-option';

    @Component({
        components: {
            DocumentPreviewComponent
        }
    })
    export default class DocumentShelfComponent extends Vue {
        @Prop({required: true})
        public documents: Document[];

        @Prop({required: true, type: Boolean}) 
        public showDocumentPreview: boolean;

        public id: string;

        public documentFocusedIndex: number | null;
        public documentListDisplayOption: LIST_DISPLAY_OPTION;
        public documentsSortOptions: string[];
        public documentsSortOptionSelected: string;

        public constructor() {
            super();

            this.id = (this.$parent.$options.name) ? `${this.$parent.$options.name}-${this.$options.name}` : `${uuid.generate}-${this.$options.name}`;

            if ( !this.$store.hasModule(this.id) ) {
                this.$store.registerModule(this.id, DocumentShelfComponentStoreModule);
            }

            this.$store.commit(DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENTS, this.documents);
            this.$store.commit(DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SORT_DOCUMENTS);

            this.documentFocusedIndex = null;
            this.documentListDisplayOption = this.$store.getters[DOCUMENT_SHELF_COMPONENT_GETTER_TYPE.GET_DOCUMENT_LIST_DISPLAY_OPTION] || Configuration.instance().documentListDisplay.displayOptionDefault;
            this.documentsSortOptions = Configuration.instance().documentSorting.sortOptions;
            this.documentsSortOptionSelected = this.$store.getters[DOCUMENT_SHELF_COMPONENT_GETTER_TYPE.GET_DOCUMENTS_SORT_OPTION_SELECTED] || Configuration.instance().documentSorting.sortOptionDefault;
        }

        public onDocumentListDisplayOptionClick(documentListDisplayOption: LIST_DISPLAY_OPTION) {
            this.$store.commit(DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENT_LIST_DISPLAY_OPTION, documentListDisplayOption);
            this.documentListDisplayOption = documentListDisplayOption
        }

        public onDocumentClick(index: number) {
            this.documentFocusedIndex = index;
        }

        public onDocumentDelete(payload: any) {
            this.$emit('documentDelete', payload);
        }

        @Watch('documents')
        public onDocumentsChange() {
            this.documentFocusedIndex = null;
        }

        public onDocumentsSortOptionChange() {
            this.$store.commit(DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SET_DOCUMENTS_SORT_OPTION_SELECTED, this.documentsSortOptionSelected);
            this.$store.commit(DOCUMENT_SHELF_COMPONENT_MUTATION_TYPE.SORT_DOCUMENTS);
        }

        public onDocumentUpdate(payload: any) {
            this.$emit('documentUpdate', payload);
        }
    }
</script>

