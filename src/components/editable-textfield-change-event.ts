export default class EditableTextfieldChangeEvent {
    public name: string;
    public value: string;

    public constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}