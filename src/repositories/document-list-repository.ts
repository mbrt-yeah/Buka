import { plainToClass } from '@marcj/marshal';

import Database from '@/database';
import DocumentList from '@/models/document-list';

export default class DocumentListRepository {
    public static async createOne(documentList: DocumentList): Promise<DocumentList> {
        const documentListCreated = Database.instance().getCollection<DocumentList>('document-lists').insertOne(documentList);

        if (!documentListCreated) {
            return Promise.reject( new Error('[DocumentListRepository] Something went wrong') );
        }

        return Promise.resolve( plainToClass(DocumentList, documentListCreated) );
    }

    public static async delete(parameter: string | DocumentList): Promise<DocumentList> {
        let listToRemove: DocumentList | undefined;

        if (typeof parameter === 'string') {
            listToRemove = await DocumentListRepository.read(parameter);
        } else {
            listToRemove = parameter;
        }

        if (!listToRemove) {
            return Promise.reject('No list to remove found');
        }

        Database.instance().getCollection<DocumentList>('document-lists').findAndRemove({ 'id' : { '$eq' : listToRemove.id } });

        return Promise.resolve(listToRemove);
    }

    public static find(query: any): Promise<DocumentList[]> {
        return new Promise((resolve, reject) => {
            const documentLists = Database.instance().getCollection<DocumentList>('document-lists').find(query);

            const finalDocumentLists: DocumentList[] = [];

            for (const documentList of documentLists) {
                finalDocumentLists.push( plainToClass(DocumentList, documentList) );
            }

            return resolve(finalDocumentLists);
        });
    }

    public static async read(id: string): Promise<DocumentList | undefined> {
        console.log(id);
        const documentList = Database.instance().getCollection<DocumentList>('document-lists').findOne({ 'id' : { '$eq' : id } });

        if (!documentList) {
            return Promise.resolve(undefined);
        }

        return Promise.resolve( plainToClass(DocumentList, documentList) );
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
}