import powerbi from "powerbi-visuals-api";
import { ScaleLinear } from "d3-scale";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { VisualFormattingSettingsModel } from "./settings";
import FormattingModel = powerbi.visuals.FormattingModel;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
export declare class Visual implements IVisual {
    private target;
    private settings;
    private formattingSettingsService;
    private tooltipServiceWrapper;
    private host;
    private data;
    private viewport;
    private isInitialRender;
    private localizationManager;
    private selectionManager;
    private selectionIdBuilder;
    constructor(options: VisualConstructorOptions);
    GenerateSelectionId(options: VisualUpdateOptions, host: IVisualHost): void;
    updateRangeXY(settings: VisualFormattingSettingsModel, data: Array<{
        x: number;
        y: number;
    }>): {
        rangeX: number[];
        rangeY: number[];
    };
    private getTooltipData;
    update(options: VisualUpdateOptions): void;
    private startAnimation;
    private renderLine;
    private renderPoint;
    callTooltip(svg: any, viewport: powerbi.IViewport, data: Array<{
        x: number;
        y: number;
    }>, xScale: ScaleLinear<number, number, never>, yScale: ScaleLinear<number, number, never>): void;
    private renderButton;
    getFormattingModel(): FormattingModel;
}
