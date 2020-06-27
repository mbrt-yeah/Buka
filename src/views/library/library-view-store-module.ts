import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import to from 'await-to-js';

import Document from '@/models/document';
import DocumentRepository from '@/repositories/document-repository';

import Facet from '@/models/facet';
import FacetValue from '@/models/facet-value';
import FacetsCreator from '@/services/facets-creator';

import LIBRARY_VIEW_ACTION_TYPE from '@/views/library/library-view-action-type';
import LIBRARY_VIEW_GETTER_TYPE from '@/views/library/library-view-getter-type';
import LIBRARY_VIEW_MUTATION_TYPE from '@/views/library/library-view-mutation-type';

@Module
export default class LibraryViewStoreModule extends VuexModule {
    public documents: Document[] = [];
    public facets: Facet[] = [];
    public facetValuesSelected: FacetValue[] = [];

    get [LIBRARY_VIEW_GETTER_TYPE.GET_ALL_DOCUMENTS](): Document[] {
        return this.documents;
    }

    get [LIBRARY_VIEW_GETTER_TYPE.GET_ALL_FACETS](): Facet[] {
        return this.facets;
    }

    get [LIBRARY_VIEW_GETTER_TYPE.GET_ALL_FACET_VALUES_SELECTED](): FacetValue[] {
        return this.facetValuesSelected;
    }

    @Mutation
    public [LIBRARY_VIEW_MUTATION_TYPE.ADD_FACET_VALUE_SELECTED](facetValue: FacetValue) {
        this.facetValuesSelected.push(facetValue);
    }

    @Mutation
    public [LIBRARY_VIEW_MUTATION_TYPE.CALCULATE_FACETS](documents: Document[]) {
        this.facets = FacetsCreator.init(documents);
    }

    @Mutation
    public [LIBRARY_VIEW_MUTATION_TYPE.REMOVE_FACET_VALUE_SELECTED](index: number) {
        if ( index < 0 || index >= this.facetValuesSelected.length ) {
            return;
        }

        this.facetValuesSelected.splice(index, 1);
    }

    @Mutation
    public [LIBRARY_VIEW_MUTATION_TYPE.SET_DOCUMENTS](documents: Document[]) {
        this.documents = documents;
    }

    @Action
    public async [LIBRARY_VIEW_ACTION_TYPE.READ_ALL_DOCUMENTS]() {
        let [readAllError, readAllResult] = await to<Document[]>( DocumentRepository.readAll() );

        if (readAllError) {
            throw readAllError;
        }

        if (!readAllResult) {
            return [];
        }

        if (this.facetValuesSelected.length === 0) {
            this.context.commit(LIBRARY_VIEW_MUTATION_TYPE.SET_DOCUMENTS, readAllResult);
            this.context.commit(LIBRARY_VIEW_MUTATION_TYPE.CALCULATE_FACETS, readAllResult);
            return readAllResult;
        }

        const filtersAvailable: { [key: string]: (documents: Document[], filterCriteria: number | string) => Document[] } = {
            'publicationYear': (documents: Document[], filterCriteria: number | string): Document[] => {
                return documents.filter((document: Document) => {
                    return document.metadata.publicationYear === filterCriteria;
                });
            }
        };

        for (const facetValueSelected of this.facetValuesSelected) {
            readAllResult = filtersAvailable[facetValueSelected.facetName](readAllResult, facetValueSelected.name);
        }

        this.context.commit(LIBRARY_VIEW_MUTATION_TYPE.SET_DOCUMENTS, readAllResult);
        this.context.commit(LIBRARY_VIEW_MUTATION_TYPE.CALCULATE_FACETS, readAllResult);

        return readAllResult;
    }
}