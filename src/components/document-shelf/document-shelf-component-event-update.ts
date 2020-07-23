import Document from '@/models/document';
import DocumentShelfComponentEventAbstract from '@/components/document-shelf/document-shelf-component-event-abstract';

export default class DocumentShelfComponentEventUpdate extends DocumentShelfComponentEventAbstract {
    public constructor(document: Document, documentFocusedIndex: number) {
       super(document, documentFocusedIndex);
    }
}