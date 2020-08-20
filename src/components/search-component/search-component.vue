<template>
    <div class="search-component">
        <button class="button" type="button" v-on:click="onSearchClick">{{ $t('Search') }}</button>
        <modal
            v-bind:adaptive="false"
            v-bind:classes="'search-modal'"
            v-bind:height="'100%'"
            v-bind:minHeight="'100%'"
            v-bind:maxHeight="'100%'"
            v-bind:name="'search-modal'"
            v-bind:width="'100%'"
            v-bind:minWidth="'100%'"
            v-bind:maxWidth="'100%'"
        >
            <div class="search-modal-content">
                <form class="search-form-simple">
                    <input type="text" class="search-box" v-bind:placeholder="`${$t('Search Documents')} …`" />
                </form>
                <ul class="search-results-list">
                
                </ul>
            </div>
        </modal>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class SearchComponent extends Vue {
        public onSearchClick(): void {
            this.$modal.show('search-modal');
        }
    }
</script>