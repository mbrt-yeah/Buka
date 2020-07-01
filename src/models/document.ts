import uuid from 'short-uuid';
import { f, plainToClass } from '@marcj/marshal';

import arrayfy from '@/utils/arrayfy';
import Author from '@/models/author';
import Fulltext from '@/models/fulltext';
import CoverImage from '@/models/cover-image';
import Metadata from '@/models/metadata';

export default class Document {
    @f public id: string;
    @f public metadata: Metadata;
    @f public coverImage: CoverImage;
    @f.optional() public fullText?: Fulltext;

    public constructor(title: string) {
        this.id = uuid.generate();
        this.coverImage = new CoverImage();
        this.metadata = new Metadata();
        this.metadata.title = title;
    }

    public addAuthors(authors: Author | Author[]) {
        authors = arrayfy<Author>(authors);
        this.metadata.authors.push(...authors);
    }

    public clone(): Document {
        return plainToClass(Document, JSON.parse(JSON.stringify(this)));
    }

    public hasAuthor(authorString: string): boolean {
        const index = this.metadata.authors.findIndex((author: Author) => {
            return author.asFacetValue() === authorString;
        });

        return (index !== -1) ? true : false;
    }
}