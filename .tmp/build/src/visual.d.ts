import powerbi from "powerbi-visuals-api";
import { ScaleLinear } from "d3-scale";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import FormattingModel = powerbi.visuals.FormattingModel;
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
    constructor(options: VisualConstructorOptions);
    /**
     * Updates the state of the visual. Every sequential databinding and resize will call update.
     *
     * @function
     * @param {VisualUpdateOptions} options - Contains references to the size of the container
     *                                        and the dataView which contains all the data
     *                                        the visual had queried.
     */
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
