<template>
    <div class="sidebar-component">
        <ul class="tabs vertical" role="tablist">
            <li class="tab">
                <router-link to="lists">Lists</router-link>
            </li>
            <li class="tab">
                <router-link to="facets">Facets</router-link>
            </li>
            <li class="tab">
                <router-link to="add-document">Add New Documents</router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class SidebarComponent extends Vue {
        public constructor() {
            super();
        }
    }
</script>