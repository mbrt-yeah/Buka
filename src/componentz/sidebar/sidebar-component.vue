<template>
    <div class="sidebar-component">
        <ul class="tabs" role="tablist">
            <!-- Lists -->
            <li class="tab">
                <input type="radio" name="tabs" id="tab2" checked="checked" />
                <label for="tab2" role="tab" aria-selected="false" aria-controls="Lists" tabindex="0">Lists</label>
                <div id="tab-content2" class="tab-content" role="tabpanel" aria-labelledby="lists" aria-hidden="true">
                    <div v-for="list in lists" class="lists">
                        <sidebar-list-component v-bind:componentData="list" />
                    </div>

                    <div class="list-options">
                        <button class="button button-small button-outline-only" type="button" @click="addNewList">New List</button>
                    </div>
                </div>
            </li>

            <!-- Facets -->
            <li class="tab">
                <input type="radio" name="tabs" id="tab1" />
                <label for="tab1" role="tab" aria-selected="true" aria-controls="Facets" tabindex="0">Facets</label>
                <div id="tab-content1" class="tab-content" role="tabpanel" aria-labelledby="facets" aria-hidden="false">
                    <div v-for="facet in facets" class="facets">
                        <sidebar-facet-component v-bind:componentData="facet" />
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Facet from '../../models/facet';
    import FacetValue from '../../models/facet-value';
    import BookList from '../../models/book-list';
    import BookListEntry from '../../models/book-list-entry';
    import SidebarFacetComponent from './sidebar-facet-component.vue';
    import SidebarListComponent from './sidebar-list-component.vue';

    @Component({
        components: {
            SidebarFacetComponent,
            SidebarListComponent
        }
    })
    export default class SidebarComponent extends Vue {
        public facets: Facet[];
        public lists: BookList[];

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

            /** ---- */

            const list1 = new BookList();
            list1.count = 123;
            list1.name = 'Customization List';

            const listValue1 = new BookListEntry();
            listValue1.text = 'A pretty cool book';

            const listValue2 = new BookListEntry();
            listValue2.text = 'Not a very good book';

            list1.entries.push(listValue1);
            list1.entries.push(listValue2);

            this.facets = [facet1];
            this.lists = [list1];
        }

        public addNewList() {
            console.log("Adding a new list");
        }
    }
</script>