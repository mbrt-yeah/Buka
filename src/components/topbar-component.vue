<template>
    <div class="topbar-component">
        <div class="app-logo">
            <img src="assets/img/logo.png" alt="App Logo" width="111" height="24" />
        </div>
        <search-box-compontent />
        <translator-component></translator-component>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import SearchBoxCompontent from './search-box-component.vue';
    import TranslatorComponent from './translator-component.vue';

    @Component({
        components: {
            SearchBoxCompontent,
            TranslatorComponent
        }
    })
    export default class TopbarComponent extends Vue {
        
    }
</script>