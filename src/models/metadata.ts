import { f } from '@marcj/marshal';
import * as MetadataJsonSchema from './metadata-json-schema.json';
import Author from '@/models/author';

export default class Metadata {
    public static jsonSchema: any = MetadataJsonSchema;

    @f.array(Author) public authors: Author[];
    @f public description: string;
    @f public pagesTotal: number;
    @f public publicationYear: number;
    @f public title: string;

    public constructor() {
        this.authors = [];
        this.description = '';
        this.pagesTotal = 0;
        this.publicationYear = 0;
        this.title = '';
    }

    public setProperty(name: string, value: any) {
        this[name] = value;
    }
}