import LIST_DISPLAY_OPTION from '@/constants/list-display-option';

export default class DocumentListDisplayConfiguration {
    public displayOptions: LIST_DISPLAY_OPTION[];
    public displayOptionDefault: LIST_DISPLAY_OPTION;

    public constructor() {
        this.displayOptions = [
            LIST_DISPLAY_OPTION.GRID,
            LIST_DISPLAY_OPTION.LIST,
            LIST_DISPLAY_OPTION.MASONRY
        ];

        this.displayOptionDefault = LIST_DISPLAY_OPTION.GRID;
    }
}