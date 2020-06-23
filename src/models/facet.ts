import { f } from '@marcj/marshal';

import FacetValue from '@/models/facet-value';

export default class Facet {
    @f public name: string;
    @f public type: string;
    @f.array(FacetValue) public values: FacetValue[];

    public constructor() {
        this.name = '';
        this.type = '';
        this.values = [];
    }
}