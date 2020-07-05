import { plainToClass } from '@marcj/marshal';

import Document from '@/models/document';
import Database from '@/database';

export default class DocumentRepository {
    public static create(document: Document): Promise<Document> {
        return new Promise((resolve, reject) => {
            const documentCreated = Database.instance().getCollection<Document>('documents').insertOne(document);

            if (!documentCreated) {
                return reject( new Error('[DocumentRepository] Something went wrong') );
            }

            return resolve( plainToClass(Document, documentCreated) );
        });
    }

    public static async createMany(documents: Document[]): Promise<Document[]> {
        return new Promise((resolve, reject) => {
            const documentsCreated = Database.instance().getCollection<Document>('documents').insert(documents);

            if (!documentsCreated) {
                return reject( new Error('[Document Repository] Something went wrong') );
            }

            const finalDocuments: Document[] = [];

            for (const document of documentsCreated) {
                finalDocuments.push( plainToClass(Document, document) );
            }

            return resolve(finalDocuments);
        });
    }

    public static async read(id: string): Promise<Document> {
        return new Promise((resolve, reject) => {
            const document = Database.instance().getCollection<Document>('documents').findOne({ 'id' : { '$eq' : id } });

            if (!document) {
                return resolve();
            }

            return resolve( plainToClass(Document, document) );
        });
    }

    public static async readAll(): Promise<Document[]> {
        return new Promise((resolve, reject) => {
            const documents = Database.instance().getCollection<Document>('documents').find();

            if (!documents) {
                return reject( new Error('[DocumentRepository] Something went wrong') );
            }

            const finalDocuments: Document[] = [];

            for (const document of documents) {
                finalDocuments.push( plainToClass(Document, document) );
            }

            resolve(finalDocuments);
        });
    }

    public static update(documentUpdated: Document): Promise<Document> {
        return new Promise((resolve, reject) => {
            Database.instance().getCollection<Document>('documents').findAndUpdate({ 'id' : { '$eq' : documentUpdated.id } }, (documentInDB: Document) => {
                return Object.assign(documentInDB, documentUpdated);
            });

            resolve(documentUpdated);
        });
    }

    public static delete(documentToRemove: Document): Promise<Document> {
        return new Promise((resolve, reject) => {
            Database.instance().getCollection<Document>('documents').findAndRemove({ 'id' : { '$eq' : documentToRemove.id } });
            return resolve(documentToRemove);
        });
    }
}