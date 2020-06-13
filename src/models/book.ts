import uuid from 'short-uuid';
import Author from './author';
import Fulltext from './fulltext';
import CoverImage from './cover-image';

export default class Book {
    public id: string;
    public coverImage?: CoverImage;
    public fullText?: Fulltext;
    public title: string;
    public authors: Author[];

    public constructor(title: string) {
        this.id = uuid.generate();
        this.title = title;
        this.authors = [];
    }

    public addAuthor(author: Author) {
        this.authors.push(author);
    }
}