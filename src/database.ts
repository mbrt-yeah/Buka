import Datastore from 'nedb';
import * as path from 'path';

import Configuration from '@/configuration';
import Document from '@/models/document';
import DocumentList from '@/models/document-list';
import Facet from '@/models/facet';

export default class Database {
    private static _instance: Database;

    public facets: Datastore<Facet>;
    public documents: Datastore<Document>;
    public documentLists: Datastore<DocumentList>;

    constructor() {
        const appDataDirPath = Configuration.instance().appDataDirPath;
        this.facets =  new Datastore({ filename: path.join(appDataDirPath, 'dbs', 'facets.db'), autoload: true });
        this.documents = new Datastore({ filename: path.join(appDataDirPath, 'dbs', 'documents.db'), autoload: true });
        this.documentLists = new Datastore({ filename: path.join(appDataDirPath, 'dbs', 'document-lists.db'), autoload: true });
    }

    public static init(): void {
        if (Database._instance) {
            return;
        }

        Database._instance = new Database();
    }

    public static instance(): Database {
        Database.init();
        return Database._instance;
    }
}