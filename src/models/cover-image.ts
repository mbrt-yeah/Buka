import { f } from '@marcj/marshal';
import DOCUMENT_COVER_DEFAULT from '@/constants/document-cover-default';

export default class CoverImage {
    @f public fileContent: string;
    @f.optional() public filePath?: string;

    public constructor() {
        this.fileContent = DOCUMENT_COVER_DEFAULT;
    }

    public getSrcAttributeValue(): string {
        if (this.filePath) {
            return this.filePath;
        }

        return this.fileContent;
    }
}