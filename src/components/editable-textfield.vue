<template>
    <div class="editable-textfield-component" v-bind:class="customClasses">
        <label v-if="!hideLabel" :for="id" class="label">{{ label }}:</label>
        <div class="textfield">
            <template v-if="isStandalone">
                <div v-if="isEditMode" class="edit-mode">
                    <input type="text" :id="id" v-model="value" :name="name" :placeholder="label" />
                    <button type="button" class="button button-small button-text button-icon-only button-positive" @click="onSaveClick">
                        <span class="iconmonstr iconmonstr-buka-save"></span>
                        <span class="text">{{ $t('Save') }}</span>
                    </button>
                    <button type="button" class="button button-small button-icon-only button-text" @click="onCancelClick">
                        <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                        <span class="text">{{ $t('Cancel') }}</span>
                    </button>
                </div>
                <div v-else class="display-mode">
                    <p class="displayed-value" v-if="value">{{value}}</p>
                    <p class="displayed-value" v-else>{{ placeholder }}</p>
                    <button type="button" class="button button-small button-text button-icon-only document-list-edit-button" @click="onEditClick">
                        <span class="iconmonstr iconmonstr-buka-pencil"></span> 
                        <span class="text">{{ $t('Edit') }}</span>
                    </button>
                    <button type="button" class="button button-small button-icon-only button-text button-negative document-list-delete-button" @click="onDeleteClick">
                        <span class="iconmonstr iconmonstr-buka-trash-can"></span>
                        <span class="text">{{ $t('Delete') }}</span>
                    </button>
                </div>
            </template>
            <template v-else>
                <div class="textfield">
                    <div v-if="isEditMode" class="edit-mode">
                        <input type="text" :id="id" v-model="value" :name="name" :placeholder="label" @keyup="onValueChange" />
                    </div>
                    <div v-else class="display-mode">
                        <p class="displayed-value" v-if="value">{{value}}</p>
                        <p class="displayed-value" v-else>{{ placeholder }}</p>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import uuid from 'short-uuid';
    import EditableTextfieldChangeEvent from '@/components/editable-textfield-change-event';

    @Component
    export default class EditableTextfield extends Vue {
        @Prop({required: false, type: String})
        public customClasses: string;

        @Prop({required: false, type: Boolean})
        public hideLabel: boolean;

        @Prop({required: false, type: Boolean})
        public isEditMode: boolean;

        @Prop({required: true, type: Boolean})
        public isStandalone: boolean;

        @Prop({required: true, type: String})
        public label: string;

        @Prop({required: true, type: String})
        public name: string;

        @Prop({required: false, type: String})
        public placeholder: string;

        @Prop({required: true})
        public value: string | number;

        public id: string;

        public constructor() {
            super();
            this.id = uuid.generate();
        }

        public onCancelClick() {
            this.isEditMode = false;
        }

        public onDeleteClick() {
            this.$emit('delete');
        }

        public onEditClick() {
            this.isEditMode = true;
        }

        public onSaveClick() {
            this.$emit('change', new EditableTextfieldChangeEvent(this.name, this.value));
            this.isEditMode = false;
        }

        public onValueChange($event: any) {
            this.$emit('change', new EditableTextfieldChangeEvent(this.name, this.value));
        }
    }
</script>