<template>
    <div class="search-dropdown-component">
        <form>
            <input type="text" class="search-box" placeholder="Search …" />
        </form>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class SearchDropdownComponent extends Vue {}
</script>