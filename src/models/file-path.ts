import * as path from 'path';

export default class FilePath {
    public parsed: path.ParsedPath;
    public value: string;

    public constructor(pathSerialized: string) {
        this.value = path.resolve(pathSerialized);
        this.parsed = path.parse(pathSerialized);
    }
}