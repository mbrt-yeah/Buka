<template>
    <div class="document-facets-component">Document Facets</div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Facet from '@/models/facet';
    import FacetValue from '@/models/facet-value';

    @Component
    export default class FacetsView extends Vue {
        public facets: Facet[];

        public constructor() {
            super();
            
            const facet1 = new Facet();
            facet1.name = 'Publication Language';
            facet1.type = 'text';

            const facetValue1 = new FacetValue();
            facetValue1.count = 12;
            facetValue1.text = 'Deutsch';

            const facetValue2 = new FacetValue();
            facetValue2.count = 24;
            facetValue2.text = 'English';

            facet1.values.push(facetValue1);
            facet1.values.push(facetValue2);

            this.facets = [facet1];
        }

        public async mounted() {}
    }
</script>

