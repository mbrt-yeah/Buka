<template>
    <div class="authors-metadata-component buka">
        <label for="authors" class="label">{{ $t(`${label}`) }}:</label>
            <ul class="authors" id="authors" v-if="authorsData.length > 0">
                <li class="author" v-for="(author, index) in authorsData" :key="index">
                    <editable-textfield
                        v-bind:customClasses="`buka firstname`"
                        v-bind:label="'firstname'"
                        v-bind:hideLabel="true"
                        v-bind:name="'firstname'"
                        v-bind:value="author['firstname']"
                        v-bind:isEditMode="isEditMode"
                        v-bind:isStandalone="false"
                        @change="onEditableTextFieldChange(index, $event)"
                    />
                    
                    <editable-textfield
                        v-bind:customClasses="`buka middlename`"
                        v-bind:label="'middlename'"
                        v-bind:hideLabel="true"
                        v-bind:name="'middlename'"
                        v-bind:value="author['middlename']"
                        v-bind:isEditMode="isEditMode"
                        v-bind:isStandalone="false"
                        @change="onEditableTextFieldChange(index, $event)"
                    />
                    
                    <editable-textfield
                        v-bind:customClasses="`buka surname`"
                        v-bind:label="'surname'"
                        v-bind:hideLabel="true"
                        v-bind:name="'surname'"
                        v-bind:value="author['surname']"
                        v-bind:isEditMode="isEditMode"
                        v-bind:isStandalone="false"
                        @change="onEditableTextFieldChange(index, $event)"
                    />

                    <button v-if="isEditMode" type="button" class="button button-small button-icon-only button-text button-negative" @click="onDeleteAuthorClick(index)">
                        <span class="iconmonstr iconmonstr-buka-trash-can"></span>
                        <span class="text">{{ $t('Delete Author') }}</span>
                    </button>
                </li>
            </ul>
            <button v-if="isEditMode" type="button" class="button button-x-small button-text button-icon-right" @click="onAddNewAuthorClick">
                <span class="iconmonstr iconmonstr-buka-plus"></span>
                {{ $t('Add New Author') }}
            </button>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import uuid from 'short-uuid';
    import Author from '@/models/author';
    import EditableAuthorsMetadataChangeEvent from '@/components/editable-authors-metadata-change-event';
    import EditableTextfield from '@/components/editable-textfield.vue';
    import EditableTextfieldChangeEvent from '@/components/editable-textfield-change-event';

    @Component({
        components: {
            EditableTextfield
        }
    })
    export default class EditableAuthorsMetadata extends Vue {
        @Prop({required: true})
        public authorsData: Author[];

        @Prop({required: false, type: String})
        public customClasses: string;

        @Prop({required: false, type: Boolean})
        public hideLabel: boolean;

        @Prop({required: false, type: Boolean})
        public isEditMode: boolean;

        @Prop({required: true, type: String})
        public label: string;

        public constructor() {
            super();
        }

        public onAddNewAuthorClick() {
            this.authorsData.push( new Author() );
        }

        public onDeleteAuthorClick(authorPosition: number) {
            this.authorsData.splice(authorPosition, 1);
        }

        public onEditClick() {
            this.isEditMode = true;
        }

        public onSaveClick() {
            this.isEditMode = false;
        }

        public onEditableTextFieldChange(authorPosition: number, event: EditableTextfieldChangeEvent) {
            this.$emit('change', new EditableAuthorsMetadataChangeEvent(authorPosition, event.name, event.value));
        }
    }
</script>