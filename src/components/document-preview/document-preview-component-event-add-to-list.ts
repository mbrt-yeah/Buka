import Document from '@/models/document';
import DocumentList from '@/models/document-list';

export default class DocumentPreviewComponentEventAddToList {
    public document: Document;
    public documentLists: DocumentList[];

    public constructor(document: Document, documentLists: DocumentList[]) {
        this.document = document;
        this.documentLists = documentLists;
    }
}