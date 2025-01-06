import powerbi from "powerbi-visuals-api";
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
    constructor(options: VisualConstructorOptions);
    /**
     * Updates the state of the visual. Every sequential databinding and resize will call update.
     *
     * @function
     * @param {VisualUpdateOptions} options - Contains references to the size of the container
     *                                        and the dataView which contains all the data
     *                                        the visual had queried.
     */
    update(options: VisualUpdateOptions): void;
    private startAnimation;
    private renderLine;
    private renderPoint;
    private renderButton;
    getFormattingModel(): FormattingModel;
}
