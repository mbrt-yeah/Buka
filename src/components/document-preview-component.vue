<template>
    <div class="document-preview-component">
        <template v-if="document">
            <div class="options">
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
        </template>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import to from 'await-to-js';

    import Document from '@/models/document';
    import DocumentRepository from '@/repositories/document-repository';
    import EditableMetadataForm from '@/components/editable-metadata-form-component.vue'
    import Metadata from '@/models/metadata';

    @Component({
        components: {
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

