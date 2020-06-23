import uuid from 'short-uuid';

import { f } from '@marcj/marshal';

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

    public addAuthor(author: Author) {
        this.metadata.authors.push(author);
    }
}