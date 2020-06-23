import { f } from '@marcj/marshal';
import FULLTEXT_TYPE from '@/constants/fulltext-type';

export default class Fulltext {
    @f.enum(FULLTEXT_TYPE) public type: FULLTEXT_TYPE;
    @f public filePath: string;

    public constructor(type: FULLTEXT_TYPE, filePath: string) {
        this.type = type;
        this.filePath = filePath;
    }
}