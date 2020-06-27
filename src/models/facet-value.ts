import { f } from '@marcj/marshal';

export default class FacetValue {
    @f
    public count: number;

    @f.array(String)
    public docs: string[];

    @f
    public facetName: string;

    @f.any()
    public name: string | number;

    public constructor() {
        this.count = 0;
        this.docs = [];
        this.facetName = '';
        this.name = '';
    }
}