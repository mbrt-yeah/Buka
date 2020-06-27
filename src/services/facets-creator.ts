import Document from '@/models/document';
import Facet from '@/models/facet';
import FacetValue from '@/models/facet-value';

export default class FacetsCreator {
    public static init(documents: Document[]): Facet[] {
        const facetPublicationYear: Facet = new Facet();
        facetPublicationYear.name = 'publicationYear';
        facetPublicationYear.type = 'date';

        documents.forEach((document: Document) => {
            const id = document.id;
            const publicationYear = document.metadata.publicationYear;
            const publicationYearKey = publicationYear.toString();

            if ( !facetPublicationYear.values[publicationYearKey] ) {
                const facetValueNew = new FacetValue();
                facetValueNew.name = document.metadata.publicationYear;
                facetPublicationYear.addNewValue(facetValueNew);
            }

            const facetValue = facetPublicationYear.values[publicationYearKey];

            facetValue.count++;
            facetValue.docs.push(id);
            facetPublicationYear.values[publicationYearKey] = facetValue;
        });

        return [facetPublicationYear];
    }
}