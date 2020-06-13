<template>
    <div class="app-component">
        <topbar-component />
        <div class="main-content-wrapper">
            <sidebar-component />
            <div class="content-components-wrapper">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Database from '../../database';
    import DatabaseTestdata from '../../database-testdata';
    import SidebarComponent from '../sidebar/sidebar-component.vue';
    import TopbarComponent from '../topbar/topbar-component.vue';

    @Component({
        components: {
            SidebarComponent,
            TopbarComponent
        }
    })
    export default class AppComponent extends Vue {
        private db: Database;

        public constructor() {
            super();
            this.db = Database.instance();
        }

        created() {
            DatabaseTestdata.insert()
                .then(() => {
                    console.log("Testdata has been inserted in db");
                    this.db.books.count({}, (error: Error, n: number) => {
                        console.log(`A total of ${n} documents has been found in the books database`);
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }
</script>

