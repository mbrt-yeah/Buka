<template>
    <div class="topbar-component">
        <div class="app-logo">
            <img src="assets/img/logo.png" alt="App Logo" width="111" height="24" />
        </div>
        <search-compontent />
        <translator-component></translator-component>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import SearchCompontent from '@/components/search-component/search-component.vue';
    import TranslatorComponent from './translator-component.vue';

    @Component({
        components: {
            SearchCompontent,
            TranslatorComponent
        }
    })
    export default class TopbarComponent extends Vue {
        
    }
</script>