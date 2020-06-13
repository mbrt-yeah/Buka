export default class FacetValue {
    public count: number;
    public text: string;
    public docs: string[];

    public constructor() {
        this.count = 0;
        this.text = '';
        this.docs = [];
    }
}