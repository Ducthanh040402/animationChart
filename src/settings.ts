/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
import NumUpDown = formattingSettings.NumUpDown;
import ToggleSwitch = formattingSettings.ToggleSwitch;
import Model = formattingSettings.Model;
import TextInput = formattingSettings.TextInput;
import FontControl = formattingSettings.FontControl;
import { autoType } from "d3";
import { AutoFlagsSelection } from "powerbi-visuals-utils-formattingmodel/lib/FormattingSettingsComponents";



/**
 * Data Point Formatting Card
 */
class DataPointCardSettings extends FormattingSettingsCard {
    defaultColor = new formattingSettings.ColorPicker({
        name: "defaultColor",
        displayName: "Chart Color",
        value: { value: "#118DFF" }
    });
    colorAfterTransition = new formattingSettings.ColorPicker({
        name: "colorAfterTransition",
        displayName: "Color Transition",
        value: { value: "#6E6566" }
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Point/Line Size",
        value: 3
    });
    sortData = new formattingSettings.ToggleSwitch({
        name: "sortData",
        displayName: "Sort",
        value: false
    });
    name: string = "dataPoint";
    displayName: string = "Data Point Settings";

    slices: Array<FormattingSettingsSlice> = [
        this.defaultColor,
        this.colorAfterTransition,
        this.fontSize,
        this.sortData
    ];
}

class SpeedTransition extends FormattingSettingsCard {
    speedShowPoint = new formattingSettings.NumUpDown({

        name: "speedTransition",
        displayName: "Transition (Default 1s)",
        value: 1
    })

    line_point_switch = new formattingSettings.ToggleSwitch({
        name: "lineorPoint",
        displayName: "Line/Point",
        value: false
    });
    showPointWhenLine = new formattingSettings.ToggleSwitch({
        name: "showPoint",
        displayName: "Show Point",
        value: false
    });
    name: string = "transitionSetting";
    displayName: string = "Transition Setting";
    slices: Array<FormattingSettingsSlice> = [
        this.speedShowPoint,
        this.line_point_switch,
        this.showPointWhenLine
    ];
}

class ShowGrid extends FormattingSettingsCard {
    isShowGrid = new formattingSettings.ToggleSwitch({
        name: "showGird",
        displayName: "Show Gird",
        value: true
    });
    isShowAxis = new formattingSettings.ToggleSwitch({
        name: "showAxis",
        displayName: "Show Axis",
        value: true
    });
    numTicksX = new formattingSettings.NumUpDown({
        name: "ticksX",
        displayName: "Ticks X",
        value: 4
    });
    numTicksY = new formattingSettings.NumUpDown({
        name: "ticksY",
        displayName: "Ticks Y",
        value: 3
    });

    name: string = "ishowGrid";
    displayName: string = "Axis and Gridlines";
    slices: Array<FormattingSettingsSlice> = [
        this.isShowGrid,
        this.isShowAxis,
        this.numTicksX,
        this.numTicksY
    ];
}

class XRange extends FormattingSettingsCard {
    name: string = "rangeX"; // same as capabilities object name
    displayName: string = "Range X-Axis";

    public minimumrangeX: formattingSettings.TextInput = new formattingSettings.TextInput({
        name: "minimumrangeX", // same as capabilities property name
        displayName: "Minimum",
        value: "",
        placeholder: "Auto"
    });
    public maximumrangeX: formattingSettings.TextInput = new formattingSettings.TextInput({
        name: "maximumrangeX", // same as capabilities property name
        displayName: "Maximum",
        value: "",
        placeholder: "Auto"
    });
    public slices: formattingSettings.Slice[] = [ this.minimumrangeX,this.maximumrangeX ];
}
class YRange extends FormattingSettingsCard {
    name: string = "rangeY"; // same as capabilities object name
    displayName: string = "Range Y-Axis";

    public minimumrangeY: formattingSettings.TextInput = new formattingSettings.TextInput({
        name: "minimumrangeY", // same as capabilities property name
        displayName: "Minimum",
        value: "",
        placeholder: "Auto"
    });
    public maximumrangeY: formattingSettings.TextInput = new formattingSettings.TextInput({
        name: "maximumrangeY", // same as capabilities property name
        displayName: "Maximum",
        value: "",
        placeholder: "Auto"
    });
    public slices: formattingSettings.Slice[] = [ this.minimumrangeY,this.maximumrangeY ];
}
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    dataPointCard = new DataPointCardSettings();
    speedTransition = new SpeedTransition()
    showGridlines = new ShowGrid()
    rangeX= new XRange()
    rangeY= new YRange()
    cards = [this.dataPointCard,
    this.speedTransition,
    this.showGridlines,
    this.rangeX,
    this.rangeY
    ];


}

