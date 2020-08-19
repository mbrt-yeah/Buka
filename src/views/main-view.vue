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
    import SidebarComponent from '@/components/sidebar-component.vue';
    import TopbarComponent from '@/components/topbar-component.vue';

    @Component({
        components: {
            SidebarComponent,
            TopbarComponent
        }
    })
    export default class MainView extends Vue {
        public constructor() {
            super();
        }
    }
</script>

