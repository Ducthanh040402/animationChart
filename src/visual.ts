import {
  formattingSettings,
  FormattingSettingsService,
} from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

import {
  BaseType,
  select as d3Select,
  Selection as d3Selection,
} from "d3-selection";
import { scaleBand, scaleLinear, ScaleLinear, ScaleBand } from "d3-scale";
import * as d3 from "d3";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { VisualFormattingSettingsModel } from "./settings";
import FormattingModel = powerbi.visuals.FormattingModel;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import {
  createTooltipServiceWrapper,
  ITooltipServiceWrapper,
  TooltipEnabledDataPoint,
} from "powerbi-visuals-utils-tooltiputils";
import { Axis, axisBottom } from "d3-axis";
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
import {
  textMeasurementService,
  valueFormatter,
} from "powerbi-visuals-utils-formattingutils";
import { dataViewObjects } from "powerbi-visuals-utils-dataviewutils";
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;

type Selection<T1 extends BaseType, T2 = any> = d3Selection<T1, T2, any, any>;

export class Visual implements IVisual {
  private target: HTMLElement;
  private settings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private tooltipServiceWrapper: ITooltipServiceWrapper;
  private host: IVisualHost;
  private data: Array<{ x: number; y: number }>;
  private viewport: powerbi.IViewport;
  private isInitialRender: boolean = false;
  private localizationManager: ILocalizationManager;

  constructor(options: VisualConstructorOptions) {
    this.host = options.host;
    this.target = options.element;
    this.formattingSettingsService = new FormattingSettingsService();
    this.settings = new VisualFormattingSettingsModel();
    this.tooltipServiceWrapper = createTooltipServiceWrapper(
      this.host.tooltipService,
      options.element
    );
    this.localizationManager = this.host.createLocalizationManager();
  }

  /**
   * Updates the state of the visual. Every sequential databinding and resize will call update.
   *
   * @function
   * @param {VisualUpdateOptions} options - Contains references to the size of the container
   *                                        and the dataView which contains all the data
   *                                        the visual had queried.
   */

  //#region Tooltip data
  private getTooltipData(value: any): VisualTooltipDataItem[] {
    console.log(value);
    // const formattedValue = valueFormatter.format(value.value, value.format);
    // const language = this.localizationManager.getDisplayName("LanguageKey");
    const displayName = value.x;
    const valueDisplace = value.y;
    return [
      {
        displayName: String(displayName),
        value: String(valueDisplace),
        color: "green",
        header: "Point value",
      },
    ];
  }

  //#endregion

  //#region Update function
  public update(options: VisualUpdateOptions): void {
    this.settings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews
      );
    if (!options.dataViews || !options.dataViews[0]) {
      return;
    }
    const dataView = options.dataViews[0];
    const categorical = dataView.categorical;

    if (!categorical || !categorical.categories || !categorical.values) {
      return;
    }
    const categories = categorical.categories[0].values;
    const values = categorical.values[0].values;
    if (!categorical.values[1]) {
      this.viewport = options.viewport;
      const data = categories.map((x, i) => ({
        x: +x,
        y: +values[i],
      }));
      this.data = data;
      if (this.settings.dataPointCard.sortData.value)
        data.sort((a, b) => a.x - b.x);
      this.data = data;
      var isPoint = this.settings.speedTransition.line_point_switch.value;
      if (isPoint) {
        this.renderPoint(this.data, options.viewport, this.isInitialRender);
      } else this.renderLine(this.data, options.viewport, this.isInitialRender);
    } else {
      /**** Have timestamp or index ****/
      const indexTime = categorical.values[1].values;
      const combinedData = categories.map((category, i) => ({
        category: category,
        value: values[i],
        indexTime: indexTime[i],
      }));
      combinedData.sort((a, b) => {
        if (a.indexTime < b.indexTime) return -1;
        if (a.indexTime > b.indexTime) return 1;
        return 0;
      });
      const sortedCategories = combinedData.map((item) => item.category);
      const sortedValues = combinedData.map((item) => item.value);
      const data = sortedCategories.map((x, i) => ({
        x: +x,
        y: +sortedValues[i],
      }));
      this.data = data;
      if (this.settings.dataPointCard.sortData.value)
        data.sort((a, b) => a.x - b.x);
      this.data = data;
      var isPoint = this.settings.speedTransition.line_point_switch.value;
      this.viewport = options.viewport;
      if (isPoint) {
        this.renderPoint(this.data, options.viewport, this.isInitialRender);
      } else this.renderLine(this.data, options.viewport, this.isInitialRender);
    }
  }
  //#endregion
  private startAnimation(isInitialRender): void {
    d3.select(this.target).selectAll("*:not(button)").remove();
    const isPoint = this.settings.speedTransition.line_point_switch.value;
    if (isPoint) {
      this.renderPoint(this.data, this.viewport, isInitialRender);
    } else {
      this.renderLine(this.data, this.viewport, isInitialRender);
    }
  }
  //#region Render Line
  private renderLine(
    data: Array<{ x: number; y: number }>,
    viewport,
    isInitialRender
  ): void {
    const width = viewport.width;
    const height = viewport.height;
    const pointColor = this.settings.dataPointCard.defaultColor.value.value;
    const lineColor = this.settings.dataPointCard.defaultColor.value.value;
    const lineWidth = this.settings.dataPointCard.fontSize.value;
    const isShowPoint = this.settings.speedTransition.showPointWhenLine.value;
    const sizePoint = this.settings.dataPointCard.fontSize.value;

    var padding = 50;
    d3.select(this.target).selectAll("*").remove();

    const svg = d3
      .select(this.target)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    console.log(this.getTooltipData(this.data));

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.x)!, d3.max(data, (d) => d.x)!])
      .range([50, width - 50]); // Padding 50

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.y)!, d3.max(data, (d) => d.y)!])
      .range([height - 50, 50]); // Padding 50

    // console.log("DoneRendeer")
    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveLinear);

    var realspeed = 100; // ms
    const speed = Number(this.settings.speedTransition.speedShowPoint.value);
    if (speed !== 0) {
      realspeed = realspeed / speed;
    }
    const xAxis = d3.axisBottom(xScale).ticks(4);
    const yAxis = d3.axisLeft(yScale).ticks(3);

    const gridX = d3
      .axisBottom(xScale)
      .tickSize(-height + 2 * padding)
      .tickFormat(() => "");

    console.log(gridX);
    const gridY = d3
      .axisLeft(yScale)
      .tickSize(-width + 2 * padding)
      .tickFormat(() => "");

    if (this.settings.showGridlines.isShowGrid.value) {
      svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(gridX)
        .selectAll("path, line")
        .style("stroke", "#e0e0e0")
        .style("opacity", 1)
        .style("stroke-dasharray", "1,1");

      svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${padding}, 0)`)
        .call(gridY)
        .selectAll("path, line")
        .style("stroke", "#e0e0e0")
        .style("opacity", 1)
        .style("stroke-dasharray", "1,1");
    }

    if (this.settings.showGridlines.isShowAxis.value) {
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(xAxis)
        .selectAll("path, line")
        .remove();
      svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .selectAll("path, line")
        .remove();
    }

    svg
      .append("path")
      .datum(data)
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", lineWidth)
      .style("opacity", 1);

    this.callTooltip(svg, viewport, data, xScale, yScale);
    if (isShowPoint) {
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", sizePoint)
        .style("fill", pointColor)
        .style("opacity", 1);
      // .transition()
      // .duration(1000)
      // .style("opacity", 1)
      // .delay((d, i) => i * realspeed);
    }
  }
  //#endregion

  //#region  Render Point
  private renderPoint(
    data: Array<{ x: number; y: number }>,
    viewport,
    isInitialRender
  ): void {
    const width = viewport.width;
    const height = viewport.height;
    const pointColor = this.settings.dataPointCard.defaultColor.value.value;
    const sizePoint = this.settings.dataPointCard.fontSize.value;
    const padding = 50; // Padding
    d3.select(this.target).selectAll("*").remove();
    this.renderButton();

    const svg = d3
      .select(this.target)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.x)!, d3.max(data, (d) => d.x)!])
      .range([50, width - 50]); // Padding 50

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.y)!, d3.max(data, (d) => d.y)!])
      .range([height - 50, 50]); // Padding 50

    var realspeed = 100; // ms
    const speed = Number(this.settings.speedTransition.speedShowPoint.value);
    if (speed !== 0) {
      realspeed = realspeed / speed;
    }
    var circles = svg.selectAll("circle").data(data);

    const xAxis = d3.axisBottom(xScale).ticks(6);
    const yAxis = d3.axisLeft(yScale).ticks(3);

    // console.log(xAxis)
    const gridX = d3
      .axisBottom(xScale)
      .tickSize(-height + 2 * padding)
      .tickFormat(() => "");

    const gridY = d3
      .axisLeft(yScale)
      .tickSize(-width + 2 * padding)
      .tickFormat(() => "");
    console.log(gridY);

    if (this.settings.showGridlines.isShowGrid.value) {
      svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(gridX)
        .selectAll("path, line")
        .style("stroke", "#e0e0e0")
        .style("opacity", 1)
        .style("stroke-dasharray", "1,1");

      svg
        .append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${padding}, 0)`)
        .call(gridY)
        .selectAll("path, line")
        .style("stroke", "#e0e0e0")
        .style("opacity", 1)
        .style("stroke-dasharray", "1,1");
    }
    if (this.settings.showGridlines.isShowAxis.value) {
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(xAxis)
        .selectAll("path, line")
        .remove();

      svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .selectAll("path, line")
        .remove();
    }
    if (isInitialRender) {
      circles
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", sizePoint)
        .style("fill", pointColor)
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .delay((d, i) => i * realspeed)
        .transition()
        .duration(1000)
        .style("opacity", (d, i) => (i >= data.length - 10 ? 1 : 0.1))
        .style("fill", (d, i) =>
          i >= data.length - 10
            ? pointColor
            : this.settings.dataPointCard.colorAfterTransition.value.value
        )
        .delay((d, i) => realspeed)
        .transition()
        .duration(1000)
        .style("opacity", (d, i) => (i >= data.length - 10 ? 1 : 0.1))
        .style("fill", (d, i) =>
          i >= data.length - 10
            ? pointColor
            : this.settings.dataPointCard.colorAfterTransition.value.value
        )
        .delay((d, i) => realspeed)
        .transition()
        .duration((data.length - 1) * realspeed)
        .style("opacity", 1)
        .style("fill", (d, i) =>
          i >= data.length - 10
            ? pointColor
            : this.settings.dataPointCard.colorAfterTransition.value.value
        );

      this.callTooltip(svg, viewport, data, xScale, yScale);
    } else {
      circles
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", sizePoint)
        .style("fill", pointColor)
        .style("opacity", 1)
        .style("fill", (d, i) =>
          i >= data.length - 10
            ? pointColor
            : this.settings.dataPointCard.colorAfterTransition.value.value
        );

      this.callTooltip(svg, viewport, data, xScale, yScale);
    }
  }
  //#endregion

  public callTooltip(
    svg,
    viewport: powerbi.IViewport,
    data: Array<{ x: number; y: number }>,
    xScale: ScaleLinear<number, number, never>,
    yScale: ScaleLinear<number, number, never>
  ): void {
    const width = viewport.width;
    const height = viewport.height;
    // Line highlight
    const verticalLine = svg
      .append("line")
      .attr("class", "vertical-line")
      .attr("y1", 50) // Padding top
      .attr("y2", height - 50) // Padding bottom
      .attr("stroke", "#000000")
      .attr("stroke-width", 1)
      .style("opacity", 0);

    const highlightPoint = svg
      .append("circle")
      .attr("class", "highlight-point")
      .attr("r", 5) // Kích thước điểm
      .attr("fill", this.settings.dataPointCard.defaultColor.value.value) // Màu đỏ

      .attr("stroke-width", 2)
      .style("opacity", 0);
    //mousemove event
    svg.on("mousemove", (event) => {
      const [mouseX] = d3.pointer(event);
      const invertedX = xScale.invert(mouseX);

      const closestPoint = data.reduce((prev, curr) =>
        Math.abs(curr.x - invertedX) < Math.abs(prev.x - invertedX)
          ? curr
          : prev
      );

      console.log(this.getTooltipData(closestPoint));

      this.tooltipServiceWrapper.addTooltip<TooltipEnabledDataPoint>(svg, () =>
        this.getTooltipData(closestPoint)
      );

      const cx = xScale(closestPoint.x);
      const cy = yScale(closestPoint.y);
      verticalLine.attr("x1", cx).attr("x2", cx).style("opacity", 1);
      highlightPoint.attr("cx", cx).attr("cy", cy).style("opacity", 1);
    });

    // Ẩn tooltip khi rời khỏi svg
    svg.on("mouseleave", () => {
      this.tooltipServiceWrapper.hide();
      verticalLine.style("opacity", 0);
      highlightPoint.style("opacity", 0);
    });
  }
  //#region Render Button
  private renderButton(): void {
    const buttonSize = 20;
    d3.select(this.target).select("#reset-button").remove();
    d3.select(this.target)
      .append("div")
      .attr("id", "reset-button")
      .style("position", "absolute")
      .style("top", "10px")
      .style("right", "10px")
      .style("width", `${buttonSize}px`)
      .style("height", `${buttonSize}px`)
      .style("background-color", "#3a3a3a")
      .style("border-radius", "50%")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("align-items", "center")
      .style("cursor", "pointer")
      .classed("reset-button", true)
      .html(
        `
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" width="12px" height="12px">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                </svg>
            `
      )
      .on("click", () => {
        this.isInitialRender = true;
        this.startAnimation(this.isInitialRender);
      });
  }
  //#endregion
  public getFormattingModel(): FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(this.settings);
  }
}
