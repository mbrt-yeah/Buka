import FacetValue from './facet-value';

export default class Facet {
    public name: string;
    public type: string;
    public values: FacetValue[];

    public constructor() {
        this.name = '';
        this.type = '';
        this.values = [];
    }
}