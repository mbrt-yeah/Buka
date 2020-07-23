export default class EditableAuthorsMetadataComponentEventChange {
    public position: number;
    public key: string;
    public value: string;

    public constructor(position: number, key: string, value: string) {
        this.position = position;
        this.key = key;
        this.value = value;
    }
}