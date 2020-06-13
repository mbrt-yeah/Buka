<template>
    <div class="sidebar-list-component">
        <h5 class="list-title">
            <span class="text">{{componentData.name}}</span>
            <label-component :value="componentData.count" />
        </h5>
        <ul v-if="componentData.entries.length > 0" class="list-values-list">
            <li v-for="entry in componentData.entries" class="list-value">
                <span class="text">{{entry.text}}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import LabelComponent from '../_common/label-component.vue';
    import List from '../../models/book-list';
import BookList from '../../models/book-list';

    @Component({
        components: {
            LabelComponent
        },
        props: ["componentData"]
    })
    export default class SidebarFacetComponent extends Vue {
        @Prop()
        public componentData: BookList;

        public constructor() {
            super();
        }
    }
</script>