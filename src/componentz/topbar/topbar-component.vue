<template>
    <div class="topbar-component">
        <div class="app-logo">
            <img src="assets/img/logo.png" alt="App Logo" width="111" height="24" />
        </div>
         <search-box-compontent />
        <!--
        <button :class="['translate-window-btn' , { 'active-top-btn' : showTranslate} ]" title="Translate"
            @click="updateShowTranslate"></button>
        <input type="range" id="brightness" @input="updateBrightness" class="fr" min="0" max="1" step="0.02" value="1"
            v-if="! toggleBooksContent" title="Brightness" />
        <button class="back-to-main-btn" title="Back to Main" v-show="! toggleBooksContent"
            @click="backToMain"></button>
        -->
        <translator-component></translator-component>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import SearchBoxCompontent from '../search-box/search-box-component.vue';
    import TranslatorComponent from '../translator/translator-component.vue';

    @Component({
        components: {
            SearchBoxCompontent,
            TranslatorComponent
        }
    })
    export default class TopbarComponent extends Vue {}
</script>