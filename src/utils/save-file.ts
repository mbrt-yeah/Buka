import * as fs from 'fs-extra';
import * as path from 'path';

const saveFile = function(folderPath: string, fileName: string, fileData: string, fileEncoding: string): string {
    fs.ensureDirSync(folderPath);
    const filePathFull = path.join(folderPath, fileName);
    fs.writeFileSync(filePathFull, fileData, fileEncoding);
    return filePathFull;
};

export default saveFile;