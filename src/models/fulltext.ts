import FULLTEXT_TYPE from '../constants/fulltext-type';
import FilePath from './file-path';

export default class Fulltext {
    public type: FULLTEXT_TYPE;
    public filePath: FilePath;

    public constructor(type: FULLTEXT_TYPE, filePath: FilePath) {
        this.type = type;
        this.filePath = filePath;
    }
}