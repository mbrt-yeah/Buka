<template>
    <div class="sidebar-facet-component">
        <h5 class="facet-title">
            <span class="text">{{componentData.name}}</span>
        </h5>
        <ul v-if="componentData.values.length > 0" class="facet-values-list">
            <li v-for="value in componentData.values" class="facet-value">
                <span class="text">{{value.text}}</span>
                <label-component :value="value.count" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import LabelComponent from '../_common/label-component.vue';
    import Facet from '../../models/facet';

    @Component({
        components: {
            LabelComponent
        },
        props: ["componentData"]
    })
    export default class SidebarFacetComponent extends Vue {
        @Prop()
        public componentData: Facet;

        public constructor() {
            super();
        }
    }
</script>