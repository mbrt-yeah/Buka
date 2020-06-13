import FilePath from './file-path';

export default class CoverImage {
    public fileContent?: string;
    public filePath?: FilePath;

    public getSrcAttributeValue(): string | undefined {
        if (this.fileContent) {
            return this.fileContent;
        }

        return this.filePath?.value;
    }
}