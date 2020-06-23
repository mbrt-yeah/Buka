import DocumentMetadataFieldOrderConfiguration from '@/configurations/document-metadata-field-order-configuration';
import DocumentSortingConfiguration from '@/configurations/document-sorting-configuration';
import DocumentListDisplayConfiguration from './configurations/document-list-display-configuration';

export default class Configuration {
    private static _instance: Configuration;

    public documentListDisplay: DocumentListDisplayConfiguration;
    public documentMetadataFieldOrder: DocumentMetadataFieldOrderConfiguration;
    public documentSorting: DocumentSortingConfiguration;

    public constructor() {
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