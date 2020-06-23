<template>
    <div class="app-component">
        <topbar-component />
        <div class="main-content-wrapper">
            <sidebar-component />
            <router-view />
        </div>
        <notifications group="app-notifications" position="bottom center" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Database from '@/database';
    import DatabaseTestdata from '@/database-testdata';
    import MAIN_VIEW_ACTION_TYPE from '@/views/main/main-view-action-type';
    import SidebarComponent from '@/components/sidebar-component.vue';
    import TopbarComponent from '@/components/topbar-component.vue';

    @Component({
        components: {
            SidebarComponent,
            TopbarComponent
        }
    })
    export default class MainView extends Vue {
        private db: Database;

        public constructor() {
            super();
            this.db = Database.instance();
        }

        public async beforeMount() {
            await this.$store.dispatch(MAIN_VIEW_ACTION_TYPE.READ_ALL_DOCUMENTS);
        }
    }
</script>

