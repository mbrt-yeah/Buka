import * as fs from 'fs-extra';
import * as path from 'path';

const deleteFile = function(filePath: string): string {
    fs.unlinkSync(filePath);
    return filePath;
};

export default deleteFile;