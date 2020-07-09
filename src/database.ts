import Datastore from 'nedb';
import Loki from 'lokijs';
import * as path from 'path';

import Configuration from '@/configuration';
import Document from '@/models/document';
import DocumentList from '@/models/document-list';
import DocumentListRepository from '@/repositories/document-list-repository';
import Facet from '@/models/facet';
import to from 'await-to-js';

export default class Database {
    private static _instance: Loki;

    public facets: Datastore<Facet>;
    public documents: Datastore<Document>;
    public documentLists: Datastore<DocumentList>;

    private constructor() {}

    public static init(): Loki {
        if (Database._instance) {
            return Database._instance;
        }

        const appDataDirPath: string = Configuration.instance().appDataDirPath;
        const dbFilePath: string = path.join(appDataDirPath, 'buka.db');

        Database._instance = new Loki(dbFilePath, {
            autoload: true,
            autoloadCallback : Database.onDatabaseInitialized,
            autosave: true,
            autosaveInterval: 10000
        });

        return Database._instance;
    }

    public static instance(): Loki {
        return Database.init();
    }

    private static onDatabaseInitialized() {
        if (!Database._instance) {
            throw new Error('database has not been initialized');
        }

        let documents: Collection<Document> = Database._instance.getCollection('documents');
        let documentLists: Collection<DocumentList> = Database._instance.getCollection('document-lists');

        if (!documents) {
            documents = Database._instance.addCollection<Document>('documents');
        }

        if (!documentLists) {
            documentLists = Database._instance.addCollection<DocumentList>('document-lists');
        }

        documents.addListener('delete', async (document: Document) => {
            const [readAllError, readAllResult] = await to<DocumentList[]>( DocumentListRepository.readAll() );

            if (readAllError) {
                throw readAllError;
            }

            if (!readAllResult) {
                throw new Error('readAllResult is undefined');
            }

            const documentListsUpdated: DocumentList[] = [];

            for (const documentList of readAllResult) {
                documentList.removeDocumentIds(document.id);
                documentListsUpdated.push(documentList);
            }

            await DocumentListRepository.updateMany(documentListsUpdated);
        });
    }
}