import { f } from '@marcj/marshal';

export default class DocumentListEntry {
    @f  public text: string;

    public constructor() {
        this.text = '';
    }
}