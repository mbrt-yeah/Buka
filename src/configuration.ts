import * as path from 'path';

import DocumentMetadataFieldOrderConfiguration from '@/configurations/document-metadata-field-order-configuration';
import DocumentSortingConfiguration from '@/configurations/document-sorting-configuration';
import DocumentListDisplayConfiguration from './configurations/document-list-display-configuration';

export default class Configuration {
    private static _instance: Configuration;

    public appName: string;
    public appDataDirPath: string;
    public documentListDisplay: DocumentListDisplayConfiguration;
    public documentMetadataFieldOrder: DocumentMetadataFieldOrderConfiguration;
    public documentSorting: DocumentSortingConfiguration;

    public constructor() {
        this.appName = 'Buka';
        this.appDataDirPath = path.resolve(path.dirname(''));
        this.documentListDisplay = new DocumentListDisplayConfiguration();
        this.documentMetadataFieldOrder = new DocumentMetadataFieldOrderConfiguration();
        this.documentSorting = new DocumentSortingConfiguration();
    }

    public static instance(): Configuration {
        if (!Configuration._instance) {
            Configuration._instance = new Configuration();
        }

        return Configuration._instance;
    }
}