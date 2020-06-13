import Book from '@/models/book';
import Database from '@/database';
import { UpdateOptions } from 'nedb';

export default class BookRepository {
    private static db: Database = Database.instance();

    public static create(book: Book): Promise<Book> {
        return new Promise((resolve, reject) => {
            this.db.books.insert(book, (error: Error, document: Book) => {
                if (error) {
                    return reject(error);
                }

                return resolve(document);
            });
        });
    }

    public static read(id: string): Promise<Book> {
        return new Promise((resolve, reject) => {
            this.db.books.findOne({ _id: id }, (error: Error, document: Book) => {
                if (error) {
                    return reject(error);
                }

                return resolve(document);
            });
        });
    }

    public static readAll(): Promise<Book[]> {
        return new Promise((resolve, reject) => {
            this.db.books.find({}, (error: Error, documents: Book[]) => {
                if (error) {
                    return reject(error);
                }

                return resolve(documents);
            });
        });
    }

    public static update(book: Book, options: UpdateOptions = {}): Promise<number> {
        const optionsDefault: UpdateOptions = {};
        const finalOptions: UpdateOptions = Object.assign(optionsDefault, options);

        return new Promise((resolve, reject) => {

            this.db.books.update({ id: book.id }, book, finalOptions, (error: Error, numberOfUpdated: number, upsert: boolean) => {
                if (error) {
                    return reject(error);
                }

                return resolve(numberOfUpdated);
            });
        });
    }

    public static delete(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.books.remove({ _id: id }, (error: Error, numberOfDeleted: number) => {
                if (error) {
                    return reject(error);
                }

                return resolve(numberOfDeleted);
            });
        });
    }
}