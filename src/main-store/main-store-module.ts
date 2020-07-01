import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import to from 'await-to-js';

import Author from '@/models/author';

import deleteFile from '@/utils/delete-file';
import Document from '@/models/document';
import DocumentRepository from '@/repositories/document-repository';

import Facet from '@/models/facet';
import FacetValue from '@/models/facet-value';
import FacetsCreator from '@/services/facets-creator';

import MAIN_STORE_ACTION_TYPE from '@/main-store/main-store-action-type';
import MAIN_STORE_GETTER_TYPE from '@/main-store/main-store-getter-type';
import MAIN_STORE_MUTATION_TYPE from '@/main-store/main-store-mutation-type';

@Module
export default class MainStoreModule extends VuexModule {
    public documents: Document[] = [];
    public facets: Facet[] = [];
    public facetValuesSelected: FacetValue[] = [];

    get [MAIN_STORE_GETTER_TYPE.GET_ALL_DOCUMENTS](): Document[] {
        return this.documents;
    }

    get [MAIN_STORE_GETTER_TYPE.GET_ALL_FACETS](): Facet[] {
        return this.facets;
    }

    get [MAIN_STORE_GETTER_TYPE.GET_ALL_FACET_VALUES_SELECTED](): FacetValue[] {
        return this.facetValuesSelected;
    }

    @Mutation
    public [MAIN_STORE_MUTATION_TYPE.ADD_FACET_VALUE_SELECTED](facetValue: FacetValue) {
        this.facetValuesSelected.push(facetValue);
    }

    @Mutation
    public [MAIN_STORE_MUTATION_TYPE.CALCULATE_FACETS](documents: Document[]) {
        this.facets = FacetsCreator.init(documents);
    }

    @Mutation
    public [MAIN_STORE_MUTATION_TYPE.REMOVE_FACET_VALUE_SELECTED](index: number) {
        if ( index < 0 || index >= this.facetValuesSelected.length ) {
            return;
        }

        this.facetValuesSelected.splice(index, 1);
    }

    @Mutation
    public [MAIN_STORE_MUTATION_TYPE.SET_DOCUMENTS](documents: Document[]) {
        this.documents = documents;
    }

    @Action
    public async [MAIN_STORE_ACTION_TYPE.READ_ALL_DOCUMENTS]() {
        let [readAllError, readAllResult] = await to<Document[]>( DocumentRepository.readAll() );

        if (readAllError) {
            throw readAllError;
        }

        if (!readAllResult) {
            return [];
        }

        if (this.facetValuesSelected.length === 0) {
            this.context.commit(MAIN_STORE_MUTATION_TYPE.SET_DOCUMENTS, readAllResult);
            this.context.commit(MAIN_STORE_MUTATION_TYPE.CALCULATE_FACETS, readAllResult);
            return readAllResult;
        }

        const filtersAvailable: { [key: string]: (documents: Document[], filterCriteria: number | string | Author) => Document[] } = {
            'author': (documents: Document[], filterCriteria: number | string | Author): Document[] => {
                return documents.filter((document: Document) => {
                    return document.hasAuthor(filterCriteria as Author);
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

        this.context.commit(MAIN_STORE_MUTATION_TYPE.SET_DOCUMENTS, readAllResult);
        this.context.commit(MAIN_STORE_MUTATION_TYPE.CALCULATE_FACETS, readAllResult);

        return readAllResult;
    }

    @Action
    public async [MAIN_STORE_ACTION_TYPE.DELETE_DOCUMENT](documentToDelete: Document) {
        const [deleteError, deleteResult] = await to<number>( DocumentRepository.delete(documentToDelete.id) );

        if (deleteError) {
            // TODO figure out what to do here
            throw deleteError;
        }

        if (deleteResult === undefined) {
            // TODO figure out what to do here
            throw new Error('deleteResult undefined');
        }

        const documentsNew = this.documents.filter((document: Document) => {
            return document.id !== documentToDelete.id;
        });

        if (documentToDelete.coverImage.filePath) {
            deleteFile(documentToDelete.coverImage.filePath);
        }

        this.context.commit(MAIN_STORE_MUTATION_TYPE.SET_DOCUMENTS, documentsNew);

        return deleteResult;
    }

    @Action
    public async [MAIN_STORE_ACTION_TYPE.UPDATE_DOCUMENT](document: Document): Promise<number> {
        const [updateError, updateResult] = await to<number>( DocumentRepository.update(document) );

        if (updateError) {
            // TODO figure out what to do here
            throw updateError;
        }

        if (!updateResult) {
            // TODO figure out what to do here
            throw new Error('updateResult undefined');
        }

        this.context.commit(MAIN_STORE_MUTATION_TYPE.NOOP);

        return updateResult;
    }
}