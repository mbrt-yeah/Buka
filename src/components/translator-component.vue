<template>
    <div class="translator-component" v-show="showTranslate">
        <!--
        <select v-model="sourceSelectedLang" class="fl">
            <option v-for="lang in languages" :value="lang.value"> {{lang.text}} </option>
        </select>
        <button id="switch-languages" title="Switch Languages" @click="switchLangs"></button>
        <select v-model="targetSelectedLang" class="fr">
            <option v-for="lang in languages" :value="lang.value"> {{lang.text}} </option>
        </select>
        <textarea v-model="sourceText" placeholder="Source Text" maxlength="1000" @keyup.enter="translate"></textarea>
        <span class="trans-char-count fr db"> {{ sourceText.length }} / 1000 </span>
        <textarea v-model="targetText" placeholder="Target Text">{{targetText}}</textarea>
        <button id="clear-translate-btn" class="fl" @click="clearText">Clear</button>
        <div id="trans-loader" class="fl" v-show="transLoader">
            <div class="dot1"></div>
            <div class="dot2"></div>
            <div class="dot3"></div>
            <div class="dot4"></div>
        </div>
        <button id="translate-btn" class="fr royal" @click="translate">Translate</button>
        -->
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class TranslatorComponent extends Vue {
        public showTranslate() {
            
        }
    }
</script>