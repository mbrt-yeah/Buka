<template>
    <div class="document-preview-component">
        <template v-if="document">
            <div class="options">
                <div class="add-to-list-option option" v-if="!isDeleteMode && !isEditMode">
                    <button type="button" class="button button-small button-text button-icon-right" @click="onAddToListClick">
                        <span class="iconmonstr iconmonstr-buka-plus"></span>
                        <span class="text">{{ $t('Add to List') }}</span>
                    </button>
                </div>
                <div class="edit-option option" v-if="!isDeleteMode">
                    <div v-if="isEditMode" class="edit-mode-on">
                        <button type="button" class="button button-small button-text button-positive" @click="onSaveClick">
                            <span class="iconmonstr iconmonstr-buka-save"></span>
                            {{ $t('Save') }}
                        </button>
                        <button type="button" class="button button-small button-text" @click="onCancelClick">
                            <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                            {{ $t('Cancel') }}
                        </button>
                    </div>
                    <div v-else class="edit-mode-off">
                        <button type="button" class="button button-small button-text" @click="onEditClick">
                            <span class="iconmonstr iconmonstr-buka-pencil"></span>
                            {{ $t('Edit') }}
                        </button>
                    </div>
                </div>
                <div class="delete-option option" v-if="!isEditMode">
                    <div v-if="isDeleteMode" class="delete-mode-on">
                        <span class="question">{{ $t('Are you sure?') }}</span> 
                        <button type="button" class="button button-small button-text button-negative" @click="onDeleteYesClick">
                            <span class="iconmonstr iconmonstr-buka-trash-can"></span>
                            {{ $t('Yes Delete') }}
                        </button>
                        <button type="button" class="button button-small button-text" @click="onDeleteNoClick">
                            <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                            {{ $t('Cancel') }}
                        </button>
                    </div>
                    <div v-else class="delete-mode-off">
                        <button type="button" class="button button-small button-text button-negative" @click="onDeleteClick">
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
                <model-data-list 
                    v-bind:model="'DocumentList'"
                    v-bind:title="'Document Lists'"
                    v-on:save="onAddToListSave"
                    v-on:cancel="onAddToListCancel" 
                />
            </modal>
        </template>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import to from 'await-to-js';

    import Document from '@/models/document';
    import DocumentList from '@/models/document-list';
    import DocumentRepository from '@/repositories/document-repository';
    import EditableMetadataForm from '@/components/editable-metadata-form-component.vue'
    import LISTS_VIEW_ACTION_TYPE from '@/views/lists/lists-view-action-type';
    import Metadata from '@/models/metadata';
    import ModelDataList from '@/components/model-data-list-component.vue';
    import NotifcationService from '@/services/notification-service';

    @Component({
        components: {
            ModelDataList,
            EditableMetadataForm
        }
    })
    export default class DocumentPreviewComponent extends Vue {
        @Prop({required: true})
        public document: Document | null;

        public metadataFormSchema: any | null;
        public isDeleteMode: boolean;
        public isEditMode: boolean;

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

        public onAddToListCancel() {
            this.$modal.hide('data-list-document-lists');
        }

        public onAddToListClick() {
            this.$modal.show('data-list-document-lists');
        }

        public async onAddToListSave(documentLists: DocumentList[]): Promise<void> {
            this.$modal.hide('data-list-document-lists');

            const l = documentLists.length;

             if (!this.document || l  === 0) {
                return;
            }

            for (const documentList of documentLists) {
               documentList.documentIds.push(this.document.id);
            }

            await this.$store.dispatch(LISTS_VIEW_ACTION_TYPE.UPDATE_ALL_LIST, documentLists);

            NotifcationService.success(`Document &raquo;${this.document.metadata.title}&laquo; has been added to &raquo;${l}&laquo; lists.`);
        }

        public onCancelClick(): void {
            this.isEditMode = false;
        }

        public onEditClick(): void {
            this.isEditMode = true;
        }

        public async onDeleteClick(): Promise<void> {
            this.isDeleteMode = true;
        }

        public async onDeleteYesClick(): Promise<void> {
            this.$emit('documentDelete', this.document);
            this.isDeleteMode = false;
        }

        public onDeleteNoClick() {
            this.isDeleteMode = false;
        }

        public async onSaveClick(): Promise<void> {
            this.$emit('documentUpdate', this.document);
            this.isEditMode = false;
        }
    }
</script>

