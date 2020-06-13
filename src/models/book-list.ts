import uuid from 'short-uuid';
import BookListEntry from './book-list-entry';

export default class BookList {
    public id: string;
    public count: number;
    public entries: BookListEntry[];
    public name: string;

    public constructor() {
        this.id = uuid.generate();
        this.count = 0;
        this.entries = [];
        this.name = '';
    }
}