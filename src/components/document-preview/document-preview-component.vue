<template>
    <div class="document-preview-component">
        <template v-if="document">
            <div class="options">
                <div class="add-to-list-option option" v-if="!isDeleteMode && !isEditMode">
                    <button type="button" class="button button-small button-text button-icon-right" @click="onAddDocumentToListClick">
                        <span class="iconmonstr iconmonstr-buka-plus"></span>
                        <span class="text">{{ $t('Add to List') }}</span>
                    </button>
                </div>
                <div class="edit-option option" v-if="!isDeleteMode">
                    <div v-if="isEditMode" class="edit-mode-on">
                        <button type="button" class="button button-small button-text button-positive" @click="onEditDocumentSaveClick">
                            <span class="iconmonstr iconmonstr-buka-save"></span>
                            {{ $t('Save') }}
                        </button>
                        <button type="button" class="button button-small button-text" @click="onEditDocumentCancelClick">
                            <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                            {{ $t('Cancel') }}
                        </button>
                    </div>
                    <div v-else class="edit-mode-off">
                        <button type="button" class="button button-small button-text" @click="onEditDocumentClick">
                            <span class="iconmonstr iconmonstr-buka-pencil"></span>
                            {{ $t('Edit') }}
                        </button>
                    </div>
                </div>
                <div class="delete-option option" v-if="!isEditMode">
                    <div v-if="isDeleteMode" class="delete-mode-on">
                        <span class="question">{{ $t('Are you sure?') }}</span> 
                        <button type="button" class="button button-small button-text button-negative" @click="onDeleteDocumentConfirmClick">
                            <span class="iconmonstr iconmonstr-buka-trash-can"></span>
                            {{ $t('Yes Delete') }}
                        </button>
                        <button type="button" class="button button-small button-text" @click="onDeleteDocumentCancelClick">
                            <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                            {{ $t('Cancel') }}
                        </button>
                    </div>
                    <div v-else class="delete-mode-off">
                        <button type="button" class="button button-small button-text button-negative" @click="onDeleteDocumentClick">
                            <span class="iconmonstr iconmonstr-buka-trash-can"></span>
                            {{ $t('Delete') }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="document">
                <img 
                    :src="document.coverImage.getSrcAttributeValue()" 
                    :alt="`Cover Image of ${document.metadata.title}`"
                    class="cover-image" 
                />
                <div class="metadata">
                    <editable-metadata-form 
                        v-bind:jsonSchema="metadataFormSchema" 
                        v-bind:formData="document.metadata"
                        v-bind:isEditMode="isEditMode"
                    />
                </div>
            </div>
            <modal v-bind:name="'data-list-document-lists'" v-bind:classes="'buka'" v-bind:height="'auto'" v-bind:adaptive="true">
                <model-data-list-component
                    v-bind:model="'DocumentList'"
                    v-bind:title="'Document Lists'"
                    v-on:confirm="onAddDocumentToListSave"
                    v-on:cancel="onAddDocumentToListCancel" 
                />
            </modal>
        </template>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import to from 'await-to-js';

    import DocumentPreviewComponentEventAddToList from '@/components/document-preview/document-preview-component-event-add-to-list.ts';
    import EditableMetadataForm from '@/components/editable-metadata-form-component.vue'
    import ModelDataListComponent from '@/components/model-data-list-component/model-data-list-component.vue';
    import ModelDataListComponentEventCancel from '@/components/model-data-list-component/model-data-list-component-event-cancel.ts';
    import ModelDataListComponentEventConfirm from '@/components/model-data-list-component/model-data-list-component-event-confirm.ts';

    import Document from '@/models/document';
    import DocumentList from '@/models/document-list';
    import Metadata from '@/models/metadata';

    import cloneObject from '@/utils/clone-object';

    @Component({
        components: {
            EditableMetadataForm,
            ModelDataListComponent
        }
    })
    export default class DocumentPreviewComponent extends Vue {
        @Prop({required: true})
        public document: Document | null;

        public metadataFormSchema: any | null;
        public isDeleteMode: boolean;
        public isEditMode: boolean;

        private documentBackup: Document | null;

        public constructor() {
            super();
            this.metadataFormSchema = Metadata.jsonSchema.default;
            this.isDeleteMode = false;
            this.isEditMode = false;
        }

        @Watch('document')
        public onDocumentChange(newDocument: Document, oldDocument: Document) {
            this.isDeleteMode = false;
            this.isEditMode = false;
        }

        public onAddDocumentToListCancel(event: ModelDataListComponentEventCancel): void {
            this.$modal.hide('data-list-document-lists');
        }

        public onAddDocumentToListClick(): void {
            this.$modal.show('data-list-document-lists');
        }

        public onAddDocumentToListSave(event: ModelDataListComponentEventConfirm): void {
            this.$modal.hide('data-list-document-lists');

            const documentLists = event.data as DocumentList[];

            if (documentLists.length === 0 || !this.document) {
                return;
            }

            this.$emit('addtolists:document', new DocumentPreviewComponentEventAddToList(this.document, documentLists));
        }

        public onEditDocumentClick(): void {
            if (!this.document) {
                return;
            }

            this.documentBackup = cloneObject<Document>(this.document, Document);
            this.isEditMode = true;
        }

        public onEditDocumentCancelClick(): void {
            if (!this.document || !this.documentBackup) {
                return;
            }

            this.document.metadata = this.documentBackup.metadata;
            this.documentBackup = null;
            this.isEditMode = false;
        }

        public async onEditDocumentSaveClick(): Promise<void> {
            this.$emit('update:document', this.document);
            this.documentBackup = null;
            this.isEditMode = false;
        }

        public async onDeleteDocumentClick(): Promise<void> {
            this.isDeleteMode = true;
        }

        public onDeleteDocumentCancelClick() {
            this.isDeleteMode = false;
        }

        public async onDeleteDocumentConfirmClick(): Promise<void> {
            this.$emit('delete:document', this.document);
            this.isDeleteMode = false;
        }
    }
</script>

