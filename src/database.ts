import Datastore from 'nedb';

import Document from './models/document';
import DocumentList from './models/document-list';
import UserDataFolder from './user-data-folder';

export default class Database {
    private static _instance: Database;

    public documents: Datastore<Document>;
    public documentLists: Datastore<DocumentList>;

    constructor() {
        this.documents = new Datastore({ filename: `${UserDataFolder.path}/dbs/documents.db`, autoload: true });
        this.documentLists = new Datastore({ filename: `${UserDataFolder.path}/dbs/documentLists.db`, autoload: true });
    }

    public static instance(): Database {
        if (!Database._instance) {
            Database._instance = new Database();
        }

        return Database._instance;
    }
}