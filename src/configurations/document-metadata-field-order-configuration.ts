export default class DocumentMetadataFieldOrderConfiguration {
    public order: string[];

    public constructor() {
        this.order = [
            'title',
            'description',
            'authors',
            'publicationYear',
            'pagesTotal'
        ];
    }
}