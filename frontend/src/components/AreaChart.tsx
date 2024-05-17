import React, { useMemo, useCallback } from "react";
import { AreaClosed, Line, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { GridRows, GridColumns } from "@visx/grid";
import { scaleTime, scaleLinear } from "@visx/scale";
import {
  withTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { localPoint } from "@visx/event";
import { LinearGradient } from "@visx/gradient";
import { max, extent, bisector } from "@visx/vendor/d3-array";
import { timeFormat } from "@visx/vendor/d3-time-format";

// Custom data types
export type ChartDataType = { createdAt: number; price: number };

type TooltipData = ChartDataType;

export const background = "black";
export const background2 = "black";
export const background3 = "#ffffff";
export const background4 = "#ffffff";

export const accentColor = "#facc15";
export const accentColorDark = "#ffffff";
export const accentColor3 = "#000000";
export const accentColorDark4 = "#ffffff";
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: "1px solid white",
  color: "white",
};

// utils
const formatDate = timeFormat("%b %d, '%y");
// accessors
const getDate = (d: ChartDataType) => new Date(d.createdAt);
const getPrice = (d: ChartDataType) => d.price;
const bisectDate = bisector<ChartDataType, Date>(
  (d) => new Date(d.createdAt)
).left;

export type AreaProps = {
  data: any;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};
// function
export default withTooltip<AreaProps, TooltipData>(
  ({
    data,
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null;

    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent([...data.buyOrder, ...data.sellOrder], getDate) as [
            Date,
            Date
          ],
        }),
      [innerWidth, margin.left]
    );
    const valueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [
            0,
            max([...data.buyOrder, ...data.sellOrder], getPrice) as number,
          ],
          nice: true,
        }),
      [margin.top, innerHeight]
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index1 = bisectDate(data.buyOrder, x0, 1);
        const index2 = bisectDate(data.sellOrder, x0, 1);

        const d0 = data.buyOrder[index1 - 1] || data.sellOrder[index2 - 1];
        const d1 = data.buyOrder[index1] || data.sellOrder[index2];
        const d2 = data.sellOrder[index2 - 1] || data.buyOrder[index1 - 1];
        const d3 = data.sellOrder[index2] || data.buyOrder[index1];

        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
              getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        if (d2 && getDate(d2)) {
          d =
            x0.valueOf() - getDate(d).valueOf() >
              getDate(d2).valueOf() - x0.valueOf()
              ? d2
              : d;
        }
        if (d3 && getDate(d3)) {
          d =
            x0.valueOf() - getDate(d).valueOf() >
              getDate(d3).valueOf() - x0.valueOf()
              ? d3
              : d;
        }

        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: valueScale(getPrice(d)),
        });
      },
      [showTooltip, valueScale, dateScale]
    );

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient
            id="area-background-gradient"
            from={background}
            to={background2}
          />
          <LinearGradient
            id="area-gradient"
            from={accentColor}
            to={accentColor}
            toOpacity={0.7}
          />
          <LinearGradient
            id="area-background-gradient-2"
            from={background3}
            to={background4}
          />
          <LinearGradient
            id="area-gradient-2"
            from={accentColor3}
            to={accentColorDark4}
            toOpacity={0.1}
          />

          <GridRows
            left={margin.left}
            scale={valueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <AreaClosed<ChartDataType>
            data={data.buyOrder}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => valueScale(getPrice(d)) ?? 0}
            yScale={valueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <AreaClosed<ChartDataType>
            data={data.sellOrder}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => valueScale(getPrice(d)) ?? 0}
            yScale={valueScale}
            strokeWidth={1}
            stroke="url(#area-gradient-2)"
            fill="url(#area-gradient-2)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              ${getPrice(tooltipData)}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: "center",
                transform: "translateX(-50%)",
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);
