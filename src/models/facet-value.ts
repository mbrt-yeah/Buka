import { f } from '@marcj/marshal';

export default class FacetValue {
    @f public count: number;
    @f public text: string;
    @f.array(String) public docs: string[];

    public constructor() {
        this.count = 0;
        this.text = '';
        this.docs = [];
    }
}