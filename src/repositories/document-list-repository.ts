import { UpdateOptions } from 'nedb';
import { plainToClass } from '@marcj/marshal';

import DocumentList from '@/models/document-list';
import Database from '@/database';

export default class DocumentListRepository {
    private static db: Database = Database.instance();

    public static create(documentList: DocumentList): Promise<DocumentList> {
        return new Promise((resolve, reject) => {
            this.db.documentLists.insert(documentList, (error: Error, documentListCreated: DocumentList) => {
                if (error) {
                    return reject(error);
                }

                return resolve( plainToClass(DocumentList, documentListCreated) );
            });
        });
    }

    public static read(id: string): Promise<DocumentList> {
        return new Promise((resolve, reject) => {
            this.db.documentLists.findOne({ _id: id }, (error: Error, documentList: DocumentList) => {
                if (error) {
                    return reject(error);
                }

                return resolve( plainToClass(DocumentList, documentList) );
            });
        });
    }

    public static readAll(): Promise<DocumentList[]> {
        return new Promise((resolve, reject) => {
            this.db.documentLists.find({}, (error: Error, documentLists: DocumentList[]) => {
                if (error) {
                    return reject(error);
                }

                const finalDocumentLists: DocumentList[] = [];

                for (const documentList of documentLists) {
                    finalDocumentLists.push( plainToClass(DocumentList, documentList) );
                }

                return resolve(finalDocumentLists);
            });
        });
    }

    public static update(documentList: DocumentList, options: UpdateOptions = {}): Promise<number> {
        const optionsDefault: UpdateOptions = {};
        const finalOptions: UpdateOptions = Object.assign(optionsDefault, options);

        return new Promise((resolve, reject) => {

            const updateCallback = (error: Error, numberOfUpdated: number, upsert: boolean) => {
                if (error) {
                    return reject(error);
                }

                return resolve(numberOfUpdated);
            };

            this.db.documentLists.update({ id: documentList.id }, documentList, finalOptions, updateCallback);
        });
    }

    public static delete(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.documentLists.remove({ _id: id }, (error: Error, numberOfDeleted: number) => {
                if (error) {
                    return reject(error);
                }

                return resolve(numberOfDeleted);
            });
        });
    }
}