export default class EditableTextFieldComponentEventChange {
    public name: string;
    public value: string | number;

    public constructor(name: string, value: string | number) {
        this.name = name;
        this.value = value;
    }
}