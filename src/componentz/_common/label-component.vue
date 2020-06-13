<template>
    <span class="label-component">{{value}}</span>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class LabelComponent extends Vue {
        @Prop({required: true, type: String})
        value: string;

        public constructor() {
            super();
        }
    }
</script>