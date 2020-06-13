<template>
    <div class="book-list-component">
        <div class="book-list-options">
            <template v-if="uploadModeActivated">
                <vue-auto-dropzone 
                    :options="dropzoneOptions"
                    :include-styling="false"
                    :destroyDropzone="true"
                    @addedfile="onAddedFile"
                    ref="dropzone" 
                />
                <button v-show="dropzoneFilesTotal > 0" class="button button-small button-outline-only" id="add-new-books-button" type="button" @click="onAddBooksClick">Add {{dropzoneFilesTotal}} Books</button>
                <button class="button button-small button-text" type="button" @click="onCloseClick">Close</button>
            </template>
            <template v-else>
                <button class="button button-small button-outline-only" type="button" @click="onNewBooksClick">New Book</button>
            </template>
        </div>
        <div class="book-list-wrapper">
            <ul class="book-list">
                <li v-for="book in books" :key="book.id" class="book">
                    <img :src="book.coverImage.fileContent" :alt="`Cover Image of ${book.title}`" />
                    <span class="book-title">{{book.title}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Book from '../../models/book';
    import BOOK_LIST_ACTION_TYPE from './book-list-action-type';
    import VueAutoDropzone from 'vue-auto-dropzone';
    import { DropzoneFile } from 'dropzone';
    import store from '@/store';

    @Component({
        components: {
            VueAutoDropzone
        }
    })
    export default class BookListComponent extends Vue {
        public books: Book[];
        public uploadModeActivated: boolean;
        public dropzone: any;
        public dropzoneFilesTotal: number;
        public dropzoneOptions: any;

        public constructor() {
            super();
            this.books = store.state.BookListStoreModule.books;
            this.uploadModeActivated = false;
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
            }
            this.dropzone = this.$refs.dropzone;
            this.dropzoneFilesTotal = 0;
        }

        public async mounted() {
            await store.dispatch(BOOK_LIST_ACTION_TYPE.READ_ALL);
            this.books = store.state.BookListStoreModule.books;
            this.dropzoneFilesTotal = 0;
        }

        public onAddBooksClick() {
            const acceptedFiles = this.$refs.dropzone["acceptedFiles"];
            console.log(acceptedFiles);
            // TODO invoke correct handler
        }

        public onAddedFile(file: DropzoneFile) {
            // TODO add only when file was accepted
            this.dropzoneFilesTotal += 1;
        }

        public onNewBooksClick() {
            this.uploadModeActivated = true;
        }

        public onCloseClick() {
            this.uploadModeActivated = false;
            this.dropzoneFilesTotal = 0;
        }
    }
</script>

