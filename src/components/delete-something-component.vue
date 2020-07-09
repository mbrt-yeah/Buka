<template>
    <div class="delete-something-component">
        <button v-if="!deleteModeTriggered" type="button" class="button button-small button-text button-icon-right button-negative" @click="onDelete">
            <span class="iconmonstr iconmonstr-buka-trash-can"></span>
            <span class="text">{{ $t(deleteButtonText) }}</span>
        </button>
        <div v-if="deleteModeTriggered" class="delete-mode">
            <span class="question">{{ $t(deleteConfirmationQuestion) }}</span>
            <button type="button" class="button button-small button-text button-icon-right button-negative" @click="onDeleteConfirm">
                <span class="iconmonstr iconmonstr-buka-trash-can"></span>
                <span class="text">{{ $t(deleteButtonConfirmText) }}</span>
            </button>
            <button type="button" class="button button-small button-text button-icon-right" @click="onDeleteCancel">
                <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                <span class="text">{{ $t(deleteButtonCancelText) }}</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class DeleteSomething extends Vue {
        @Prop({required: true, type: String})
        public deleteButtonText: string;

        @Prop({required: true, type: String})
        public deleteButtonCancelText: string;

        @Prop({required: true, type: String})
        public deleteButtonConfirmText: string;

        @Prop({required: true, type: String})
        public deleteConfirmationQuestion: string;

        public deleteModeTriggered: boolean; 

        public constructor() {
            super();
            this.deleteModeTriggered = false;
        }

        public onDelete() {
            this.deleteModeTriggered = true;
        }

        public onDeleteCancel() {
            this.deleteModeTriggered = false;
        }

        public onDeleteConfirm() {
            this.deleteModeTriggered = false;
            this.$emit('deleteconfirmed');
        }
    }
</script>