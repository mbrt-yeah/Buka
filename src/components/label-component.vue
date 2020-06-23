<template>
    <span class="label-component">{{value}}</span>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class LabelComponent extends Vue {
        @Prop({required: true})
        public value: string | number;

        public constructor() {
            super();
        }
    }
</script>