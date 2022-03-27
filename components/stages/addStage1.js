const d3 = require("d3");
import {
    fadeIn,
    graphHeight,
    graphWidth,
    padding,
    percentageYScale,
    data, pomFirstGen,
    pomLabels,
    pomonaColors,
    widthIn,
    delay,
    duration, hmcFirstGen, pomAdm, hmcDemographics, hmcLabels, hmcColors,
} from "./helpers";

function demoGraph(stage1, data, labels, colors = pomonaColors, numBeforePoc = 3, xOffset = padding) {
    const dataConverted = [Object.fromEntries(data[0].map((d, i) => [i, d]))];
    const percPoc = [...data[0]].splice(numBeforePoc).reduce((a, b) => a + b, 0);
    const dataStacked = d3.stack().keys([...Array(data[0].length).keys()])(dataConverted).map(d => d[0]);

    let needLegend = [];

    const demGraph = stage1.append("g")
        .attr("class", "popOut")
        .style("transform", `translate(${xOffset}px, ${padding + 140}px)`);

    const demRect = demGraph.selectAll(".stage1PomDemRect")
        .data(dataStacked)
        .enter()
        .append("rect")
        .attr("class", "stage1PomDemRect widthOut")
        .attr("x", 0)
        .attr("y", d => percentageYScale(d[0]))
        .attr("height", d => percentageYScale(d[1] - d[0]))
        .attr("fill", (d, i) => colors[i]);

    widthIn(demRect);

    demGraph.selectAll(".stage1PomDemLine")
        .data(dataStacked)
        .enter()
        .append("line")
        .attr("class", "stage1PomDemLine fadeOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", d => percentageYScale(d[1]))
        .attr("y2", d => percentageYScale(d[1]))
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .style("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", 0.25);

    demGraph.selectAll(".stage1PomDemLabel")
        .data(dataStacked)
        .enter()
        .append("text")
        .attr("class", "stage1PomDemLabel fadeOut")
        .text((d, i) => {
            if (d[1] - d[0] > 5) return `${labels[i]}: ${data[0][i]}%`;
            needLegend.push({index: i, label: `${labels[i]}: ${data[0][i]}%`});
            return "";
        })
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-after-edge")
        .attr("x", graphWidth)
        .attr("y", d => percentageYScale(d[1]) - 4)
        .style("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", 0.25);

    const legend = demGraph.selectAll(".stage1DemLegend")
        .data(needLegend)
        .enter()
        .append("g")
        .attr("class", "fadeOut")
        .style("transform", (d, i) => `translate(0, ${graphHeight + padding + i * 24}px)`);

    legend.append("rect")
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", d => colors[d.index]);

    legend.append("text")
        .text(d => d.label)
        .attr("x", 28)
        .style("font-size", 12)
        .style("opacity", 0.5)
        .attr("dominant-baseline", "text-before-edge");

    fadeIn(legend);

    const pocLineY = percentageYScale(100 - percPoc);

    const stage1PocLine = demGraph.append("line")
        .attr("class", "fadeOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", pocLineY)
        .attr("y2", pocLineY)
        .attr("stroke-width", 2)
        .attr("stroke", "black");

    fadeIn(stage1PocLine);

    const stage1PocLabel = demGraph.append("text")
        .attr("class", "fadeOut")
        .text(`D. s. of color: ${percPoc}%`)
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-before-edge")
        .attr("x", graphWidth)
        .attr("y", pocLineY + 4);

    fadeIn(stage1PocLabel);
}

function firstGenGraph(stage1, percentFirstGen, xOffset = 2 * padding + graphWidth) {
    const firstGenGroup = stage1.append("g")
        .attr("class", "popOut")
        .style("transform", `translate(${xOffset}px, ${padding + 140}px)`);

    const firstGenRect1 = firstGenGroup.append("rect")
        .attr("height", graphHeight)
        .attr("fill", "#2c4391")
        .attr("class", "widthOut");

    widthIn(firstGenRect1);

    const firstGenRect2 = firstGenGroup.append("rect")
        .attr("height", percentageYScale(100 - percentFirstGen))
        .attr("fill", "#eee")
        .attr("class", "widthOut");

    widthIn(firstGenRect2);

    const firstGenLine = firstGenGroup.append("line")
        .attr("class", "fadeOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", percentageYScale(100 - percentFirstGen))
        .attr("y2", percentageYScale(100 - percentFirstGen))
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("stroke", "black");

    fadeIn(firstGenLine);

    const firstGenLabel = firstGenGroup.append("text")
        .text(`First-gen students: ${percentFirstGen}%`)
        .attr("class", "fadeOut")
        .attr("x", graphWidth)
        .attr("y", percentageYScale(100 - percentFirstGen) - 4)
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-after-edge")
        .attr("fill", "black");

    fadeIn(firstGenLabel);
}

export function addStage1 (svg, isVertical) {
    svg.select("#title").text("Class of 2026");

    const stage1 = svg.append("g")
        .attr("id", "stage1")
        .attr("class", "popOut");

    demoGraph(stage1, pomAdm, pomLabels);

    demoGraph(stage1, hmcDemographics, hmcLabels, hmcColors, 1, 3 * padding + 2 * graphWidth);

    firstGenGraph(stage1, pomFirstGen[0]);

    firstGenGraph(stage1, hmcFirstGen[0], 4 * padding + 3 * graphWidth);
}