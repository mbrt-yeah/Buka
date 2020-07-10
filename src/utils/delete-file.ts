import * as fs from 'fs-extra';

const deleteFile = function(filePath: string): string {
    if ( !fs.existsSync(filePath) ) {
        return filePath;
    }

    fs.unlinkSync(filePath);
    return filePath;
};

export default deleteFile;