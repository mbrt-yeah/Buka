import uuid from 'short-uuid';
import { f, plainToClass } from '@marcj/marshal';

import DocumentListEntry from '@/models/document-list-entry';

export default class DocumentList {
    @f public id: string;
    @f public count: number;
    @f.array(DocumentListEntry) public entries: DocumentListEntry[];
    @f public name: string;

    public constructor() {
        this.id = uuid.generate();
        this.count = 0;
        this.entries = [];
        this.name = '';
    }

    public clone(): DocumentList {
        return plainToClass(DocumentList, JSON.parse(JSON.stringify(this)));
    }
}