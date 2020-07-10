import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import to from 'await-to-js';

import Author from '@/models/author';

import deleteFile from '@/utils/delete-file';
import Document from '@/models/document';

import DocumentRepository from '@/repositories/document-repository';
import DocumentListRepository from '@/repositories/document-list-repository';

import Facet from '@/models/facet';
import FacetValue from '@/models/facet-value';
import FacetsCreator from '@/services/facets-creator';

import LIBRARY_STORE_MODULE_ACTION_TYPE from '@/store-modules/library/library-store-module-action-type';
import LIBRARY_STORE_MODULE_GETTER_TYPE from '@/store-modules/library/library-store-module-getter-type';
import LIBRARY_STORE_MODULE_MUTATION_TYPE from '@/store-modules/library/library-store-module-mutation-type';

import LIST_STORE_MODULE_ACTION_TYPE from '@/store-modules/list/lists-store-module-action-type';

@Module
export default class LibraryStoreModule extends VuexModule {
    public documents: Document[] = [];
    public facets: Facet[] = [];
    public facetValuesSelected: FacetValue[] = [];

    get [LIBRARY_STORE_MODULE_GETTER_TYPE.DOCUMENT_GET_ALL](): Document[] {
        return this.documents;
    }

    get [LIBRARY_STORE_MODULE_GETTER_TYPE.FACET_GET_ALL](): Facet[] {
        return this.facets;
    }

    get [LIBRARY_STORE_MODULE_GETTER_TYPE.FACET_VALUE_SELECTED_GET_ALL](): FacetValue[] {
        return this.facetValuesSelected;
    }

    @Mutation
    public [LIBRARY_STORE_MODULE_MUTATION_TYPE.DOCUMENT_SET_ALL](documents: Document[]): void {
        this.documents = documents;
    }

    @Mutation
    public [LIBRARY_STORE_MODULE_MUTATION_TYPE.FACET_CALCULATE_ALL](documents: Document[]): void {
        this.facets = FacetsCreator.init(documents);
    }

    @Mutation
    public [LIBRARY_STORE_MODULE_MUTATION_TYPE.FACET_VALUE_ADD_SELECTED](facetValue: FacetValue): void {
        this.facetValuesSelected.push(facetValue);
    }

    @Mutation
    public [LIBRARY_STORE_MODULE_MUTATION_TYPE.FACET_VALUE_REMOVE_SELECTED](index: number): void {
        if ( index < 0 || index >= this.facetValuesSelected.length ) {
            return;
        }

        this.facetValuesSelected.splice(index, 1);
    }

    @Action
    public async [LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_CREATE_MANY](documents: Document[]): Promise<Document[]> {
        const [createDocumentsError, createDocumentsResult] = await to<Document[]>( DocumentRepository.createMany(documents) );

        if (createDocumentsError) {
            throw createDocumentsError;
        }

        if (!createDocumentsResult) {
            throw new Error('createDocumentsResult undefined');
        }

        return createDocumentsResult;
    }

    @Action
    public async [LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_CREATE_ONE](document: Document): Promise<Document> {
        const [createDocumentError, createDocumentResult] = await to( DocumentRepository.create(document) );

        if (createDocumentResult) {
            throw createDocumentResult;
        }

        if (!createDocumentResult) {
            throw new Error('createDocumentResult undefined');
        }

        return createDocumentResult;
    }

    @Action
    public async [LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_DELETE_ONE](documentToDelete: Document): Promise<Document> {
        const [deleteError, deleteResult] = await to<Document>( DocumentRepository.delete(documentToDelete) );

        if (deleteError) {
            throw deleteError;
        }

        if (deleteResult === undefined) {
            throw new Error('deleteResult undefined');
        }

        if (documentToDelete.coverImage.filePath) {
            deleteFile(documentToDelete.coverImage.filePath);
        }

        const documentLists = await DocumentListRepository.find({ 'documentIds': { '$contains': documentToDelete.id } });

        if (documentLists.length > 0) {
            for (const documentList of documentLists) {
                documentList.removeDocumentIds(documentToDelete.id);
            }

            await this.context.dispatch(LIST_STORE_MODULE_ACTION_TYPE.LIST_UPDATE_MANY, documentLists);
        }

        await this.context.dispatch(LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_READ_ALL);

        return documentToDelete;
    }

    @Action
    public async [LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_READ_ALL](): Promise<Document[]> {
        let [readAllError, readAllResult] = await to<Document[]>( DocumentRepository.readAll() );

        if (readAllError) {
            throw readAllError;
        }

        if (!readAllResult) {
            return [];
        }

        if (this.facetValuesSelected.length === 0) {
            this.context.commit(LIBRARY_STORE_MODULE_MUTATION_TYPE.DOCUMENT_SET_ALL, readAllResult);
            this.context.commit(LIBRARY_STORE_MODULE_MUTATION_TYPE.FACET_CALCULATE_ALL, readAllResult);
            return readAllResult;
        }

        const filtersAvailable: { [key: string]: (documents: Document[], filterCriteria: number | string | Author) => Document[] } = {
            'author': (documents: Document[], filterCriteria: number | string | Author): Document[] => {
                return documents.filter((document: Document) => {
                    return document.hasAuthor((filterCriteria as Author).toString());
                });
            },
            'publicationYear': (documents: Document[], filterCriteria: number | string | Author): Document[] => {
                return documents.filter((document: Document) => {
                    return document.metadata.publicationYear === filterCriteria;
                });
            }
        };

        for (const facetValueSelected of this.facetValuesSelected) {
            readAllResult = filtersAvailable[facetValueSelected.facetName](readAllResult, facetValueSelected.name);
        }

        this.context.commit(LIBRARY_STORE_MODULE_MUTATION_TYPE.DOCUMENT_SET_ALL, readAllResult);
        this.context.commit(LIBRARY_STORE_MODULE_MUTATION_TYPE.FACET_CALCULATE_ALL, readAllResult);

        return readAllResult;
    }

    @Action
    public async [LIBRARY_STORE_MODULE_ACTION_TYPE.DOCUMENT_UPDATE_ONE](document: Document): Promise<Document> {
        const [updateError, updateResult] = await to<Document>( DocumentRepository.update(document) );

        if (updateError) {
            // TODO figure out what to do here
            throw updateError;
        }

        if (!updateResult) {
            // TODO figure out what to do here
            throw new Error('updateResult undefined');
        }

        this.context.commit(LIBRARY_STORE_MODULE_MUTATION_TYPE.FACET_CALCULATE_ALL, this.documents);

        return updateResult;
    }
}