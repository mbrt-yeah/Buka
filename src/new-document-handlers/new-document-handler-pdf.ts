import * as path from 'path';
import { getDocument, PDFDocumentProxy, PDFInfo, PDFMetadata, PDFPageProxy } from 'pdfjs-dist';
import Document from '@/models/document';
import to from 'await-to-js';

import Fulltext from '@/models/fulltext';
import FULLTEXT_TYPE from '@/constants/fulltext-type';
import Metadata from '@/models/metadata';
import CoverImage from '@/models/cover-image';

export default class NewDocumentHandlerPDF {
    private readonly filePDF: File;

    public constructor(filePDF: File) {
        this.filePDF = filePDF;
    }

    public async init(): Promise<Document> {
        const [readFileError, readFileResult] = await to<string | ArrayBuffer>( this.readFile() );

        if (readFileError) {
            throw readFileError;
        }

        if (!readFileResult) {
            throw new Error('readFileResult undefined');
        }

        const pdfPromise = getDocument({ data: readFileResult}).promise;

        return new Promise(async (resolve, reject) => {
            pdfPromise.then(
                async (pdfDocumentProxy: PDFDocumentProxy) => {
                    const coverImage: CoverImage = await this.extractCoverImg(pdfDocumentProxy);
                    const fulltext: Fulltext = new Fulltext(FULLTEXT_TYPE.PDF, path.resolve(this.filePDF.path));
                    const metadata: Metadata = await this.extractMetadata(pdfDocumentProxy);

                    const document = new Document(metadata.title);
                    document.coverImage = coverImage;
                    document.fullText = fulltext;
                    document.metadata = metadata;
                    document.metadata.pagesTotal = pdfDocumentProxy.numPages;

                    resolve(document);
                },
                (reason: string) => {
                    reject( new Error(reason) );
                }
            );
        });
    }

    private async readFile(): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onloadend = (event: ProgressEvent<FileReader>) => {
                if (!fileReader.result) {
                    return reject( new Error('No data') );
                }

                return resolve(fileReader.result);
            };

            fileReader.onerror = (event: ProgressEvent<FileReader>) => {
                reject(fileReader.error);
            };

            fileReader.readAsArrayBuffer(this.filePDF);
        });
    }

    private async extractCoverImg(pdfDocumentProxy: PDFDocumentProxy): Promise<any> {
        return new Promise((resolve, reject) => {
            const onSuccess = (result: PDFPageProxy) => {
                resolve();
            };

            const onError = (reason: string) => {
                reject( new Error(reason) );
            };

            pdfDocumentProxy.getPage(1).then(onSuccess, onError);
        });
    }

    private async extractMetadata(pdfDocumentProxy: PDFDocumentProxy): Promise<Metadata> {
        return new Promise((resolve, reject) => {
            const onSuccess = (result: { info: PDFInfo, metadata: PDFMetadata}) => {
                const defaultMetadata: Metadata = new Metadata();
                defaultMetadata.title = this.filePDF.name;

                const embeddedMetadata: Metadata = new Metadata();

                if (result.metadata) {
                    embeddedMetadata.title = result.metadata.get('dc:title') || this.filePDF.name;
                    embeddedMetadata.description = result.metadata.get('dc:description');
                    //embeddedMetadata.authors = result.metadata.get('dc:creator');
                }

                const finalMetadata: Metadata = Object.assign(defaultMetadata, embeddedMetadata);

                resolve(finalMetadata);
            };

            const onError = (reason: string) => {
                reject( new Error(reason) );
            };

            pdfDocumentProxy.getMetadata().then(onSuccess, onError);
        });
    }
}