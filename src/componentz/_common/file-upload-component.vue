<template>
    <form id="dropzone"></form>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Dropzone from 'dropzone';

    @Component
    export default class FileUploadComponent extends Vue {
        public constructor() {
            super();
        }

        public mounted() {
            const element = this.$el;
            
            new Dropzone("#dropzone", {
                url: "/file/post"
            });
        }
    }
</script>