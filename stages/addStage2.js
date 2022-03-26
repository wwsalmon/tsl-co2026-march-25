import {
    graphHeight,
    graphWidth,
    padding,
    percentageYScale,
    pomAdm,
    pomonaColors,
    widthIn,
    delay,
    duration
} from "./helpers";
const d3 = require("d3");

export function addStage2 (svg, isVertical) {
    const pomData = pomAdm.map(d => Object.fromEntries(d.map((d, i) => [i, d])));
    const pomPercPoc = pomAdm.map(d => [...d].splice(3).reduce((a, b) => a + b, 0));
    const pomStack = d3.stack(pomData).keys(Object.keys(pomData[0]))(pomData);

    svg.select("#subtitle-slot-1").text("Admitted class composition over time");

    const area = d3.area()
        .x((d, i) => i * (graphWidth / (pomAdm.length - 1)))
        .y0(d => percentageYScale(d[0]))
        .y1(d => percentageYScale(d[1]));

    const line = d3.line()(pomPercPoc.map((d, i) => [
        i * (graphWidth / (pomAdm.length - 1)),
        percentageYScale(100 - d),
    ]));

    const stage2 = svg.append("g")
        .attr("id", "stage2")
        .attr("class", "popOut");

    const defs = stage2.append("defs").attr("class", "popOut");

    const clipLeft1 = defs.append("clipPath")
        .attr("id", "clipLeft1")
        .append("rect")
        .attr("class", "widthOut")
        .attr("width", 0)
        .attr("height", graphHeight);

    const clipLeft2 = defs.append("clipPath")
        .attr("id", "clipLeft2")
        .append("rect")
        .attr("class", "widthOut")
        .attr("width", 0)
        .attr("height", graphHeight);

    const clipMidLeft = defs.append("clipPath")
        .attr("id", "clipMidLeft")
        .append("rect")
        .attr("class", "widthOut")
        .attr("x", padding + graphWidth)
        .attr("width", 0)
        .attr("height", graphHeight);

    const pomDemoGraph = stage2.append("g")
        .attr("class", "popOut")
        .style("transform", `translate(${padding}px, ${padding + 140}px)`);

    pomDemoGraph.selectAll(".stage2PomArea")
        .data(pomStack)
        .enter()
        .append("path")
        .attr("fill", (d, i) => pomonaColors[i])
        .attr("class", "popOut")
        .attr("d", area)
        .attr("clip-path", "url(#clipLeft1)");

    pomDemoGraph.append("path")
        .attr("d", line)
        .attr("class", "popOut")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("clip-path", "url(#clipLeft2)");

    pomDemoGraph.append("line")
        .attr("class", "popOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", graphWidth / 2)
        .attr("y2", graphWidth / 2)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", 4)
        .attr("fill", "none")
        .attr("stroke", "white")
        .style("opacity", 0.5)
        .attr("clip-path", "url(#clipLeft2)");

    pomDemoGraph.append("text")
        .text("50% d. s. of color")
        .attr("class", "stage2Label fadeOut")
        .attr("x", 8)
        .attr("y", graphHeight / 2 + 4)
        .style("font-size", 12)
        .attr("dominant-baseline", "text-before-edge")
        .attr("fill", "white")
        .style("opacity", 0)
        .transition()
        .delay(delay + 300)
        .duration(duration)
        .style("opacity", 0.5);

    widthIn(clipLeft1, graphWidth);

    widthIn(clipLeft2, graphWidth, delay + 300);
}