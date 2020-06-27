import { f } from '@marcj/marshal';
import FacetValue from '@/models/facet-value';

export default class Facet {
    @f
    public name: string;

    @f
    public type: string;

    @f.map(FacetValue)
    public values: { [key: string]: FacetValue };

    public constructor() {
        this.name = '';
        this.type = '';
        this.values = {};
    }

    public addNewValue(facetValue: FacetValue) {
        if (this.values[facetValue.name]) {
            return;
        }

        facetValue.facetName = this.name;
        this.values[facetValue.name] = facetValue;
    }
}