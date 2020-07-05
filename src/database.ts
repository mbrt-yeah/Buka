import Datastore from 'nedb';
import Loki from 'lokijs';
import * as path from 'path';

import Configuration from '@/configuration';
import Document from '@/models/document';
import DocumentList from '@/models/document-list';
import Facet from '@/models/facet';

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

        const documents = Database._instance.getCollection('documents');
        const documentLists = Database._instance.getCollection('document-lists');

        if (!documents) {
            Database._instance.addCollection<Document>('documents');
        }

        if (!documentLists) {
            Database._instance.addCollection<DocumentList>('document-lists');
        }
    }
}