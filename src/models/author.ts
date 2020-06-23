import uuid from 'short-uuid';
import { f } from '@marcj/marshal';

export default class Author {
    @f public id: string;
    @f public title: string;
    @f public firstname: string;
    @f public middlename: string;
    @f public surname: string;

    public constructor() {
        this.id = uuid.generate();
        this.title = '';
        this.firstname = '';
        this.middlename = '';
        this.surname = '';
    }
}