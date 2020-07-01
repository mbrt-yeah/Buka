import { f } from '@marcj/marshal';
import DOCUMENT_COVER_DEFAULT from '@/constants/document-cover-default';
import * as process from 'process';

export default class CoverImage {
    @f public fileContent: string;
    @f public fileName: string;
    @f public fileExtension: string;
    @f.optional() public filePath?: string;

    public constructor() {
        this.fileContent = DOCUMENT_COVER_DEFAULT;
        this.fileName = '';
    }

    public getSrcAttributeValue(): string {
        if (this.filePath) {
            // TODO fix this hack
            if (process.env.NODE_ENV === 'development') {
                return `http://localhost:8080/cover-images/${this.fileName}.${this.fileExtension}`;
            }

            return this.filePath;
        }

        return this.fileContent;
    }
}