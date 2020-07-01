import { f } from '@marcj/marshal';

import arrayfy from '@/utils/arrayfy';
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
        const key = facetValue.name as string;

        if (!this.values[key]) {
            this.values[key] = facetValue;
            this.values[key].addDocs(facetValue.docs);
        }

        this.values[facetValue.name].count++;
    }

    public addNewValues(facetValues: FacetValue | FacetValue[]) {
        facetValues = arrayfy<FacetValue>(facetValues);

        for (const facetValue of facetValues) {
            this.addNewValue(facetValue);
        }
    }

    public valuesTotal(): number {
        return Object.keys(this.values).length;
    }
}