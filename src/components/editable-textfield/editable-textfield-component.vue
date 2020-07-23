<template>
    <div class="editable-textfield-component" v-bind:class="customClasses">
        <label v-if="!hideLabel" v-bind:for="id" class="label">{{ label }}:</label>

        <div class="textfield">
            <div v-if="isEditModeInternal" class="edit-mode">
                <input 
                    type="text"
                    v-bind:id="id"
                    v-bind:name="name"
                    v-bind:placeholder="label" 
                    v-bind:value="valueInternal"
                    v-on:keyup="onValueChange($event)"
                />

                <button v-if="showEditButton" type="button" class="button button-small button-text button-icon-only button-positive" @click="onSaveClick">
                    <span class="iconmonstr iconmonstr-buka-save"></span>
                    <span class="text">{{ $t('Save') }}</span>
                </button>

                <button v-if="showEditButton" type="button" class="button button-small button-icon-only button-text" @click="onCancelClick">
                    <span class="iconmonstr iconmonstr-buka-x-mark"></span>
                    <span class="text">{{ $t('Cancel') }}</span>
                </button>
            </div>

            <div v-else class="display-mode">
                <template v-if="displayValueAs === 'button'">
                    <button @click="onDisplayedValueClick" type="button" class="button button-small button-text displayed-value">{{ valueInternal }}</button>
                </template>

                <template v-else>
                    <p class="displayed-value" v-if="valueInternal">{{ valueInternal }}</p>
                    <p class="displayed-value" v-else>{{ placeholder }}</p>
                </template>

                <button v-if="showEditButton" @click="onEditClick" type="button" class="button button-small button-text button-icon-only edit-button" >
                    <span class="iconmonstr iconmonstr-buka-pencil"></span> 
                    <span class="text">{{ $t('Edit') }}</span>
                </button>

                <button v-if="showDeleteButton" @click="onDeleteClick" type="button" class="button button-small button-icon-only button-text button-negative delete-button">
                    <span class="iconmonstr iconmonstr-buka-trash-can"></span>
                    <span class="text">{{ $t('Delete') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import uuid from 'short-uuid';
    import * as util from 'util';

    import EditableTextfieldComponentEventChange from '@/components/editable-textfield/editable-textfield-component-event-change';

    @Component
    export default class EditableTextfield extends Vue {
        @Prop({required: false, type: String, default: ''})
        public customClasses: string;

        @Prop({required: false, type: String, default: ''})
        public displayValueAs: string;

        @Prop({required: false, type: Boolean, default: false})
        public hideLabel: boolean;

        @Prop({required: false, type: Boolean, default: false})
        public isEditMode: boolean;

        @Prop({required: true, type: String})
        public label: string;

        @Prop({required: true, type: String})
        public name: string;

        @Prop({required: false, type: String, default: ''})
        public placeholder: string;

        @Prop({required: false, type: Boolean, default: true})
        public showEditButton: boolean;

        @Prop({required: false, type: Boolean, default: true})
        public showDeleteButton: boolean;

        @Prop({required: true})
        public value: string | number;

        public id: string;

        public isEditModeInternal: Boolean;
        public valueInternal: string | number;

        public constructor() {
            super();
            this.id = uuid.generate();
            this.isEditModeInternal = this.isEditMode || false;
            this.valueInternal = this.value;
        }

        public onCancelClick() {
            this.isEditModeInternal = false;
        }

        public onDeleteClick() {
            this.$emit('delete');
        }

        public onDisplayedValueClick() {
            this.$emit('displayedValueClick', this.value);
        }

        public onEditClick() {
            this.isEditModeInternal = true;
            console.log(this.isEditModeInternal);
        }

        @Watch('isEditMode')
        public onEditModeChange() {
            this.isEditModeInternal = this.isEditMode;
        }

        public onSaveClick() {
            this.$emit('save:value', new EditableTextfieldComponentEventChange(this.name, this.valueInternal));
            this.isEditModeInternal = false;
        }

        public onValueChange(event: any) {
            this.valueInternal = event.target.value
            this.$emit('update:value', new EditableTextfieldComponentEventChange(this.name, this.valueInternal));
        }
    }
</script>