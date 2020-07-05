import uuid from 'short-uuid';
import { f, plainToClass } from '@marcj/marshal';

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

    public clone(): DocumentList {
        return plainToClass(DocumentList, JSON.parse(JSON.stringify(this)));
    }
}