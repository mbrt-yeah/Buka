<template>
    <form class="search-box-component">
        <input type="text" class="search-box" placeholder="Search …" />
    </form>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class SearchBoxCompontent extends Vue {}
</script>