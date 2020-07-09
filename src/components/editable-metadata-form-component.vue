<template>
    <div class="json-schema-form-component">
        <form>
            <div class="field-wrapper" v-for="(propertyValue, propertyName) in jsonSchema.properties" v-bind:key="propertyName">
                <editable-authors-metadata 
                    v-if="propertyValue.type === 'array' && propertyName === 'authors'"
                    v-bind:authorsData="formData[propertyName]"
                    v-bind:customClasses="`${propertyName}`"
                    v-bind:isEditMode="isEditMode"
                    v-bind:label="propertyName"
                    @change="onEditableAuthorsMetadataChange"
                />
                <editable-textfield
                    v-if="propertyValue.type === 'number' || propertyValue.type === 'string'"
                    v-bind:customClasses="`${propertyName}`"
                    v-bind:label="propertyName"
                    v-bind:name="propertyName"
                    v-bind:value="formData[propertyName]"
                    v-bind:isEditMode="isEditMode"
                    v-bind:placeholder="'-'"
                    v-bind:showEditButton="false"
                    v-bind:showDeleteButton="false"
                    @change="onEditableTextFieldChange"
                />
            </div>
        </form>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    import Configuration from '@/configuration';
    import Metadata from '@/models/metadata';
    import EditableAuthorsMetadata from '@/components/editable-authors-metadata-component.vue';
    import EditableAuthorsMetadataChangeEvent from '@/components/editable-authors-metadata-change-event';
    import EditableTextfield from '@/components/editable-textfield.vue';
    import EditableTextfieldChangeEvent from '@/components/editable-textfield-change-event.vue';

    @Component({
        components: {
            EditableAuthorsMetadata,
            EditableTextfield
        }
    })
    export default class EditableMetadataForm extends Vue {
        @Prop({ required: true, type: Boolean })
        public isEditMode: boolean;

        @Prop({ required: true })
        public jsonSchema: any;

        @Prop({ required: true, type: Metadata})
        public formData: Metadata;

        public beforeMount() {
            this.reorderMetadataFields();
        }

        public onEditableAuthorsMetadataChange(event: EditableAuthorsMetadataChangeEvent) {
            this.formData.authors[event.position][event.key] = event.value;
        }

        public onEditableTextFieldChange(event: EditableTextfieldChangeEvent) {
            this.formData[event.name] = event.value;
        }

        private reorderMetadataFields() {
            const orderConfigured = Configuration.instance().documentMetadataFieldOrder.order;
            const schemaPropertiesNew: any = {};

            for (const fieldName of orderConfigured) {
                schemaPropertiesNew[fieldName] = this.jsonSchema.properties[fieldName];
            }

            this.jsonSchema.properties = schemaPropertiesNew;
        }
    }
</script>