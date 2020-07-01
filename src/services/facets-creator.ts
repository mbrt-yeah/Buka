import Document from '@/models/document';
import Facet from '@/models/facet';
import FacetValue from '@/models/facet-value';

export default class FacetsCreator {
    public static init(documents: Document[]): Facet[] {
        const facetPublicationYear: Facet = new Facet();
        facetPublicationYear.name = 'publicationYear';
        facetPublicationYear.type = 'date';

        const facetAuthor: Facet = new Facet();
        facetAuthor.name = 'author';
        facetAuthor.type = 'text';

        for (const document of documents) {
            const facetValuePublicationYear: FacetValue = new FacetValue();
            facetValuePublicationYear.name = document.metadata.publicationYear;
            facetValuePublicationYear.facetName = facetPublicationYear.name;
            facetValuePublicationYear.addDocs(document.id);
            facetPublicationYear.addNewValues(facetValuePublicationYear);

            for (const author of document.metadata.authors) {
                const facetValueAuthor: FacetValue = new FacetValue();
                facetValueAuthor.name = author.asFacetValue();
                facetValueAuthor.facetName = facetAuthor.name;
                facetValueAuthor.addDocs(document.id);
                facetAuthor.addNewValues(facetValueAuthor);
            }
        }

        return [facetPublicationYear, facetAuthor];
    }
}