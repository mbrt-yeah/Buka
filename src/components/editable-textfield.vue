<template>
    <div class="editable-textfield-component" v-bind:class="customClasses">
        <label v-if="!hideLabel" :for="id" class="label">{{ label }}:</label>
        <div class="textfield">
            <div class="edit-mode" v-if="isEditMode">
                <input type="text" :id="id" v-model="value" :name="name" :placeholder="label" @keyup="onValueChange" />
            </div>
            <div class="display-mode" v-else>
                <p class="displayed-value" v-if="value">{{value}}</p>
                <p class="displayed-value" v-else>{{ placeholder }}</p>
            </div>
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

        public onEditClick() {
            this.isEditMode = true;
        }

        public onSaveClick() {
            this.isEditMode = false;
        }

        public onValueChange($event: any) {
            this.$emit('change', new EditableTextfieldChangeEvent(this.name, this.value));
        }
    }
</script>