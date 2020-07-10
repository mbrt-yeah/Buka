<template>
    <div class="view" id="add-document-view-component" >
        <div class="view-content">
            <vue-auto-dropzone
                :options="dropzoneOptions"
                :include-styling="false"
                :destroyDropzone="true"
                @addedfile="onDocumentsAdded"
                class="document-new-dropzone"
                ref="dropzone" 
            />

            <div class="buttons">
                <button 
                    type="button" 
                    class="button button-small button-text button-positive" @click="onDocumentsSaveClick">
                    <span class="iconmonstr iconmonstr-buka-save"></span>
                    {{ $t(`Save ${dropzoneFilesTotal} Documents`) }}
                </button>
                <button type="button" class="button button-small button-text" @click="onDocumentsCancelClick">
                    <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                    {{ $t('Cancel') }}
                </button>
            </div>

            <document-shelf-component
                v-if="documents.length > 0"
                v-bind:documents="documents"
                v-bind:showDocumentPreview="true"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { DropzoneFile } from 'dropzone';
    import VueAutoDropzone from 'vue-auto-dropzone';
    import to from 'await-to-js';

    import Document from '@/models/document';
    import DocumentShelfComponent from '@/components/document-shelf/document-shelf-component.vue';
    import LIBRARY_STORE_MODULE_ACTION_TYPE from '@/store-modules/library/library-store-module-action-type';
    import NewDocumentHandlerPDF from '@/new-document-handlers/new-document-handler-pdf';
    import NotifictionService from '@/services/notification-service';

    @Component({
        components: {
            DocumentShelfComponent,
            VueAutoDropzone
        }
    })
    export default class AddDocumentsView extends Vue {
        public documents: Document[];
        public dropzone: any;
        public dropzoneFilesTotal: number;
        public dropzoneOptions: any;

        public constructor() {
            super();
            this.documents = [];
            this.dropzone = this.$refs.dropzone;
            this.dropzoneFilesTotal = 0;
            this.dropzoneOptions = {
                acceptedFiles: 'application/pdf',
                autoProcessQueue: false,
                clickable: true,
                createImageThumbnails: false,
                url: 'https://www.example.com',
                previewTemplate: `<div class="dz-preview dz-file-preview well" id="dz-preview-template">
                    <div class="dz-details">
                        <div class="dz-file-details">
                            <div class="dz-filename" data-dz-name></div>
                            <div class="dz-size" data-dz-size></div>
                        </div>
                        <div class="dz-progress">
                            <span class="dz-upload" data-dz-uploadprogress></span>
                        </div>
                        <div class="dz-error-message"><span data-dz-errormessage></span></div>
                    </div>
                </div>`
            };
        }

        public mounted(): void {
            this.documents = [];
            this.dropzone = this.$refs.dropzone;
            this.dropzoneFilesTotal = 0;
        }

        public onDocumentsAdded(file: DropzoneFile): void {
            this.dropzoneFilesTotal += 1;
        }

        public onDocumentsCancelClick(): void {
            this.dropzone.removeAllFiles(true);
            this.dropzoneFilesTotal = 0;
        }

        public async onDocumentsSaveClick(): Promise<void> {
            const acceptedFiles = this.dropzone['acceptedFiles']
            const acceptedFilesTotal = acceptedFiles.length;

            if (acceptedFilesTotal === 0) {
                return;
            }

            const documentsNew: Document[] = [];

            for (const acceptedFile of acceptedFiles) {
                const documentHandler = new NewDocumentHandlerPDF(acceptedFile);
                const [handlerError, handlerResult] = await to<Document>( documentHandler.init() );

                if (handlerError) {
                    throw handlerError;
                }

                if (!handlerResult) {
                    throw new Error('handlerResult undefined');
                }

                documentsNew.push(handlerResult);
            }

            const [dispatchError, documents] = await to<Document[]>( this.$store.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_CREATE_MANY, documentsNew) );

            if (dispatchError) {
                throw dispatchError;
            }

            if (!documents) {
                throw new Error('documents undefined');
            }

            this.documents = documents;
            this.dropzone.removeAllFiles(true);
            this.dropzoneFilesTotal = 0;

            NotifictionService.success(`${acceptedFilesTotal} documents saved`);
        }
    }
</script>

