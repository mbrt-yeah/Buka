import Document from '@/models/document';

export default abstract class DocumentShelfComponentEventAbstract {
    public document: Document;
    public documentFocusedIndex: number;

    public constructor(document: Document, documentFocusedIndex: number) {
        this.document = document;
        this.documentFocusedIndex = documentFocusedIndex;
    }
}