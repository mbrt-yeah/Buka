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

    public authorsAsFacetValues(): string[] {
        const facetValues: string[] = [];

        for(const author of this.authors) {
            facetValues.push( author.asFacetValue() );
        }

        return facetValues;
    }

    public setProperty(name: string, value: any) {
        this[name] = value;
    }

    public merge(metadataToMerge: Metadata): Metadata {
        this.authors.push(...metadataToMerge.authors);

        if (metadataToMerge.description && metadataToMerge.description !== '') {
            this.description = metadataToMerge.description;
        }

        if (metadataToMerge.pagesTotal && metadataToMerge.pagesTotal !== 0) {
            this.pagesTotal = metadataToMerge.pagesTotal;
        }

        if (metadataToMerge.publicationYear && metadataToMerge.publicationYear !== 0) {
            this.publicationYear = metadataToMerge.publicationYear;
        }

        if (metadataToMerge.title && metadataToMerge.title !== '') {
            this.title = metadataToMerge.title;
        }

        return this;
    }
}