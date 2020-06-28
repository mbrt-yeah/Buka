import uuid from 'short-uuid';
import { f } from '@marcj/marshal';

import DocumentListEntry from '@/models/document-list-entry';

export default class DocumentList {
    @f public _id: string;
    @f public id: string;
    @f public count: number;
    @f.array(DocumentListEntry) public entries: DocumentListEntry[];
    @f public name: string;

    public constructor() {
        this._id = uuid.generate();
        this.id = uuid.generate();
        this.count = 0;
        this.entries = [];
        this.name = '';
    }
}