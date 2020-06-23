export default class DocumentSortingConfiguration {
    public sortOptions: string[];
    public sortOptionDefault: string;

    public constructor() {
        this.sortOptions = [
            'title_asc',
            'title_desc',
            'publicationYear_asc',
            'publicationYear_desc'
        ];

        this.sortOptionDefault = 'title_asc';
    }
}