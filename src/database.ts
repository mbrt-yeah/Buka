import Datastore from 'nedb';

import Book from './models/book';
import BookList from './models/book-list';
import UserDataFolder from './user-data-folder';

export default class Database {
    private static _instance: Database;

    public books: Datastore<Book>;
    public bookList: Datastore<BookList>;

    constructor() {
        this.books = new Datastore<Book>(); // new Datastore({ filename: `${UserDataFolder.path}/dbs/books.db`, autoload: true });
        this.bookList = new Datastore<BookList>();
    }

    public static instance(): Database {
        if (!Database._instance) {
            Database._instance = new Database();
        }

        return Database._instance;
    }
}