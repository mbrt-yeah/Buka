import { UpdateOptions } from 'nedb';

import BookList from '@/models/book-list';
import Database from '@/database';

export default class BookListRepository {
    private static db: Database = Database.instance();

    public static create(bookList: BookList): Promise<BookList> {
        return new Promise((resolve, reject) => {
            this.db.bookList.insert(bookList, (error: Error, document: BookList) => {
                if (error) {
                    return reject(error);
                }

                return resolve(document);
            });
        });
    }

    public static read(id: string): Promise<BookList> {
        return new Promise((resolve, reject) => {
            this.db.bookList.findOne({ _id: id }, (error: Error, document: BookList) => {
                if (error) {
                    return reject(error);
                }

                return resolve(document);
            });
        });
    }

    public static readAll(): Promise<BookList[]> {
        return new Promise((resolve, reject) => {
            this.db.bookList.find({}, (error: Error, documents: BookList[]) => {
                if (error) {
                    return reject(error);
                }

                return resolve(documents);
            });
        });
    }

    public static update(bookList: BookList, options: UpdateOptions = {}): Promise<number> {
        const optionsDefault: UpdateOptions = {};
        const finalOptions: UpdateOptions = Object.assign(optionsDefault, options);

        return new Promise((resolve, reject) => {

            const updateCallback = (error: Error, numberOfUpdated: number, upsert: boolean) => {
                if (error) {
                    return reject(error);
                }

                return resolve(numberOfUpdated);
            };

            this.db.bookList.update({ id: bookList.id }, bookList, finalOptions, updateCallback);
        });
    }

    public static delete(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.bookList.remove({ _id: id }, (error: Error, numberOfDeleted: number) => {
                if (error) {
                    return reject(error);
                }

                return resolve(numberOfDeleted);
            });
        });
    }
}