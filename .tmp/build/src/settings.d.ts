import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * Data Point Formatting Card
 */
declare class DataPointCardSettings extends FormattingSettingsCard {
    defaultColor: formattingSettings.ColorPicker;
    colorAfterTransition: formattingSettings.ColorPicker;
    fontSize: formattingSettings.NumUpDown;
    sortData: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
declare class SpeedTransition extends FormattingSettingsCard {
    speedShowPoint: formattingSettings.NumUpDown;
    line_point_switch: formattingSettings.ToggleSwitch;
    showPointWhenLine: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
declare class ShowGrid extends FormattingSettingsCard {
    isShowGrid: formattingSettings.ToggleSwitch;
    isShowAxis: formattingSettings.ToggleSwitch;
    numTicksX: formattingSettings.NumUpDown;
    numTicksY: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
declare class XRange extends FormattingSettingsCard {
    name: string;
    displayName: string;
    minimumrangeX: formattingSettings.TextInput;
    maximumrangeX: formattingSettings.TextInput;
    slices: formattingSettings.Slice[];
}
declare class YRange extends FormattingSettingsCard {
    name: string;
    displayName: string;
    minimumrangeY: formattingSettings.TextInput;
    maximumrangeY: formattingSettings.TextInput;
    slices: formattingSettings.Slice[];
}
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    dataPointCard: DataPointCardSettings;
    speedTransition: SpeedTransition;
    showGridlines: ShowGrid;
    rangeX: XRange;
    rangeY: YRange;
    cards: (XRange | YRange | DataPointCardSettings | SpeedTransition | ShowGrid)[];
}
export {};
