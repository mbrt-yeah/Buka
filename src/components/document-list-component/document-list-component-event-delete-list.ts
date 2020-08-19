import DocumentList from '@/models/document-list';

export default class DocumentListComponentEventDeleteList {
    public static id = 'delete:list';
    public list: DocumentList;

    public constructor(list: DocumentList) {
        this.list = list;
    }
}