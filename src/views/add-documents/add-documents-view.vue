<template>
    <div class="document-new-component">
        <vue-auto-dropzone
            :options="dropzoneOptions"
            :include-styling="false"
            :destroyDropzone="true"
            @addedfile="onAddedFile"
            class="document-new-dropzone"
            ref="dropzone" 
        />
        <button 
            v-bind:class="{ disabled: dropzoneFilesTotal > 0 }"
            @click="onAddDocumentsClick"
            class="button button-small button-outline-only"
            id="add-new-documents-button"
            type="button">Add {{dropzoneFilesTotal}} Documents</button>

        <document-shelf-component 
            v-bind:documents="documents"
            v-bind:showDocumentPreview="true"
            v-if="documents.length > 0"
        />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { DropzoneFile } from 'dropzone';
    import VueAutoDropzone from 'vue-auto-dropzone';
    import to from 'await-to-js';

    import MAIN_VIEW_MUTATION_TYPE from '@/views/main/main-view-mutation-type';
    import Document from '@/models/document';
    import DocumentRepository from '@/repositories/document-repository';
    import DocumentShelfComponent from '@/components/document-shelf/document-shelf-component.vue';
    import NewDocumentHandlerPDF from '@/new-document-handlers/new-document-handler-pdf';
    import NotifictionService from '@/services/notification-service';
    import store from '@/store';

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

        public async mounted() {
            await this.$store.commit(MAIN_VIEW_MUTATION_TYPE.SET_SHOW_SIDEBAR, false);
            this.documents = [];
            this.dropzone = this.$refs.dropzone;
            this.dropzoneFilesTotal = 0;
        }

        public async onAddDocumentsClick(): Promise<void> {
            const acceptedFiles = this.dropzone['acceptedFiles']
            const acceptedFilesTotal = acceptedFiles.length;

            if (acceptedFilesTotal === 0) {
                return;
            }

            for (const acceptedFile of acceptedFiles) {
                const documentHandler = new NewDocumentHandlerPDF(acceptedFile);
                const [handlerError, handlerResult] = await to<Document>( documentHandler.init() );

                if (handlerError) {
                    throw handlerError;
                }

                if (!handlerResult) {
                    throw new Error('handlerResult undefined');
                }

                const [createError, createResult] = await to<Document>( DocumentRepository.create(handlerResult) );

                if (createError) {
                    throw createError;
                }

                if (!createResult) {
                    throw new Error('createResult undefined');
                }

                this.documents.push(createResult);
            }

            NotifictionService.success(`${acceptedFilesTotal} documents added`);

            this.dropzone.removeAllFiles(true);
            this.dropzoneFilesTotal = 0;
        }

        public onAddedFile(file: DropzoneFile) {
            this.dropzoneFilesTotal += 1;
        }
    }
</script>

