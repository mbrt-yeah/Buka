import { plainToClass } from '@marcj/marshal';

import DocumentList from '@/models/document-list';
import Database from '@/database';

export default class DocumentListRepository {
    public static async create(documentList: DocumentList): Promise<DocumentList> {
        return new Promise((resolve, reject) => {
            const documentListCreated = Database.instance().getCollection<DocumentList>('document-lists').insertOne(documentList);

            if (!documentListCreated) {
                return reject( new Error('[DocumentListRepository] Something went wrong') );
            }

            return resolve( plainToClass(DocumentList, documentListCreated) );
        });
    }

    public static async read(id: string): Promise<DocumentList> {
        return new Promise((resolve, reject) => {
            const documentList = Database.instance().getCollection<DocumentList>('document-lists').findOne({ 'id' : { '$eq' : id } });

            if (!documentList) {
                return resolve();
            }

            return resolve( plainToClass(DocumentList, documentList) );
        });
    }

    public static readAll(): Promise<DocumentList[]> {
        return new Promise((resolve, reject) => {
            const documentLists = Database.instance().getCollection<DocumentList>('document-lists').find();

            if (!documentLists) {
                return reject( new Error('[DocumentListRepository] Something went wrong') );
            }

            const finalDocumentLists: DocumentList[] = [];

            for (const documentList of documentLists) {
                finalDocumentLists.push( plainToClass(DocumentList, documentList) );
            }

            return resolve(finalDocumentLists);
        });
    }

    public static update(documentListUpdated: DocumentList): Promise<DocumentList> {
        return new Promise((resolve, reject) => {
            Database.instance().getCollection<DocumentList>('document-lists').findAndUpdate({ 'id' : { '$eq' : documentListUpdated.id } }, (documentListInDB: DocumentList) => {
                return Object.assign(documentListInDB, documentListUpdated);
            });

            resolve(documentListUpdated);
        });
    }

    public static updateMany(documentListsUpdated: DocumentList[]): Promise<DocumentList[]> {
        const updateOps: Promise<DocumentList>[] = [];

        for (const documentListUpdated of documentListsUpdated) {
            updateOps.push( this.update(documentListUpdated) );
        }

        return Promise.all<DocumentList>(updateOps);
    }

    public static delete(documentListToRemove: DocumentList): Promise<DocumentList> {
        return new Promise((resolve, reject) => {
            Database.instance().getCollection<DocumentList>('document-lists').findAndRemove({ 'id' : { '$eq' : documentListToRemove.id } });
            return resolve(documentListToRemove);
        });
    }
}