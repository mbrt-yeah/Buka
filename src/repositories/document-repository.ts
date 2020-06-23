import { UpdateOptions } from 'nedb';
import { plainToClass } from '@marcj/marshal';

import Document from '@/models/document';
import Database from '@/database';


export default class DocumentRepository {
    private static db: Database = Database.instance();

    public static create(document: Document): Promise<Document> {
        return new Promise((resolve, reject) => {
            this.db.documents.insert(document, (error: Error, documentCreated: Document) => {
                if (error) {
                    return reject(error);
                }

                return resolve( plainToClass(Document, documentCreated) );
            });
        });
    }

    public static read(id: string): Promise<Document> {
        return new Promise((resolve, reject) => {
            this.db.documents.findOne({ _id: id }, (error: Error, document: Document) => {
                if (error) {
                    return reject(error);
                }

                return resolve( plainToClass(Document, document) );
            });
        });
    }

    public static readAll(): Promise<Document[]> {
        return new Promise((resolve, reject) => {
            this.db.documents.find({}, (error: Error, documents: Document[]) => {
                if (error) {
                    return reject(error);
                }

                const finalDocuments: Document[] = [];

                for (const document of documents) {
                    finalDocuments.push( plainToClass(Document, document) );
                }

                return resolve(finalDocuments);
            });
        });
    }

    public static update(document: Document, options: UpdateOptions = {}): Promise<number> {
        const optionsDefault: UpdateOptions = {};
        const finalOptions: UpdateOptions = Object.assign(optionsDefault, options);

        return new Promise((resolve, reject) => {

            this.db.documents.update({ id: document.id }, document, finalOptions, (error: Error, numberOfUpdated: number, upsert: boolean) => {
                if (error) {
                    return reject(error);
                }

                return resolve(numberOfUpdated);
            });
        });
    }

    public static delete(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.documents.remove({ id: id }, (error: Error, numberOfDeleted: number) => {
                if (error) {
                    console.log('DocumentRepository.delete');
                    console.error(error);
                    return reject(error);
                }

                console.log('DocumentRepository.delete');
                console.log(`Total deleted: ${numberOfDeleted}`);

                return resolve(numberOfDeleted);
            });
        });
    }
}