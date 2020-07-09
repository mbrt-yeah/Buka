import uuid from 'short-uuid';
import { f, plainToClass } from '@marcj/marshal';

import arrayfy from '@/utils/arrayfy';

export default class DocumentList {
    @f
    public id: string;

    @f
    public count: number;

    @f.array(String)
    public documentIds: string[];

    @f
    public name: string;

    public constructor() {
        this.id = uuid.generate();
        this.count = 0;
        this.documentIds = [];
        this.name = '';
    }

    public addDocumentIds(ids: string | string[]): number {
        ids = arrayfy<string>(ids);

        let documentIdsAdded: number = 0;

        for (const id of ids) {
            if (this.documentIds.indexOf(id) !== -1) {
                continue;
            }

            this.documentIds.push(id);
            documentIdsAdded++;
        }

        return documentIdsAdded;
    }

    public clone(): DocumentList {
        return plainToClass(DocumentList, JSON.parse(JSON.stringify(this)));
    }
}