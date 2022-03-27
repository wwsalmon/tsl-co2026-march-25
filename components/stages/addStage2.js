import {
    addLegend,
    delay,
    fadeIn,
    graphHeight,
    graphWidth,
    hmcColors,
    hmcDemographics,
    hmcFirstGen,
    hmcLabels,
    padding,
    percentageYScale,
    pomAdmStage2,
    pomFirstGen,
    pomonaColors,
    widthIn,
} from "./helpers";

const d3 = require("d3");

function addTimeAxis(group, numYears) {
    const timeAxis = d3
        .axisBottom(d3.scaleLinear().domain([2026, 2026 - numYears]).range([graphWidth, 0]))
        .tickFormat(d => d)
        .ticks(numYears / Math.floor(numYears / 4))
        .tickSize(0);

    const firstGenAxis = group.append("g")
        .call(timeAxis)
        .attr("class", "fadeOut")
        .style("transform", `translate(0,${graphHeight + 6}px)`)
        .style("font-size", 9);

    fadeIn(firstGenAxis, 0.5);
}

function addDemoGraph(stage2, defs, data, labels, colors = pomonaColors, numBeforePoc = 3, xOffset = padding) {
    const area = d3.area()
        .x((d, i, a) => i * (graphWidth / (a.length - 1)))
        .y0(d => percentageYScale(d[0]))
        .y1(d => percentageYScale(d[1]));

    const dataConverted = data.map(d => Object.fromEntries(d.map((d, i) => [i, d])));
    const percPoc = data.map(d => [...d].splice(numBeforePoc).reduce((a, b) => a + b, 0)).reverse();
    const dataStacked = d3.stack().keys(Object.keys(dataConverted[0]))(dataConverted.reverse());

    const line = d3.line()(percPoc.map((d, i) => [
        i * (graphWidth / (percPoc.length - 1)),
        percentageYScale(100 - d),
    ]));

    const demoGraph = stage2.append("g")
        .attr("class", "popOut")
        .style("transform", `translate(${xOffset}px, ${padding + 140}px)`);

    demoGraph.selectAll(".stage2PomArea")
        .data(dataStacked)
        .enter()
        .append("path")
        .attr("fill", (d, i) => colors[i])
        .attr("class", "popOut")
        .attr("d", area)
        .attr("clip-path", "url(#clipLeft1)");

    demoGraph.append("path")
        .attr("d", line)
        .attr("class", "popOut")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("clip-path", "url(#clipLeft2)");

    demoGraph.append("line")
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

    const poc2026Line = demoGraph.append("line")
        .attr("class", "fadeOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", percentageYScale(100 - percPoc[percPoc.length - 1]))
        .attr("y2", percentageYScale(100 - percPoc[percPoc.length - 1]))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", 4)
        .attr("fill", "none")
        .attr("stroke", "white");

    fadeIn(poc2026Line, 0.75);

    const poc2026Label = demoGraph.append("text")
        .text(`${percPoc[percPoc.length - 1]}%`)
        .attr("class", "fadeOut")
        .attr("x", graphWidth - 8)
        .attr("y", percentageYScale(100 - percPoc[percPoc.length - 1]) + 4)
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-before-edge")
        .attr("fill", "white");

    fadeIn(poc2026Label, 0.75);

    const poc50Label = demoGraph.append("text")
        .text("50% d. s. of color")
        .attr("class", "fadeOut")
        .attr("x", 8)
        .attr("y", graphHeight / 2 + 4)
        .style("font-size", 12)
        .attr("dominant-baseline", "text-before-edge")
        .attr("fill", "white");

    fadeIn(poc50Label, 0.5);

    addTimeAxis(demoGraph, data.length);

    addLegend(demoGraph, hmcLabels, hmcColors);
}

function addFirstGenGraph(stage2, defs, data, xOffset = 2 * padding + graphWidth) {
    const area = d3.area()
        .x((d, i, a) => i * (graphWidth / (a.length - 1)))
        .y0(d => graphHeight)
        .y1(d => {
            console.log(d);
            return graphHeight - percentageYScale(d)
        });

    const firstGenGraph = stage2.append("g")
        .attr("class", "popOut")
        .style("transform", `translate(${xOffset}px, ${padding + 140}px)`);

    firstGenGraph.append("rect")
        .attr("clip-path", "url(#clipLeft1)")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .attr("fill", "#eee");

    firstGenGraph.append("path")
        .attr("clip-path", "url(#clipLeft2)")
        .attr("fill", pomonaColors[0])
        .attr("class", "popOut")
        .datum(data)
        .attr("d", area);

    const firstGen2026Line = firstGenGraph
        .append("line")
        .attr("class", "fadeOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", percentageYScale(100 - data[data.length - 1]))
        .attr("y2", percentageYScale(100 - data[data.length - 1]))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", 4)
        .attr("fill", "none")
        .attr("stroke", "black");

    fadeIn(firstGen2026Line, 0.75);

    const firstGen2026Label = firstGenGraph.append("text")
        .text(`${data[data.length - 1]}%`)
        .attr("class", "fadeOut")
        .attr("x", graphWidth - 8)
        .attr("y", percentageYScale(100 - data[data.length - 1]) - 4)
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-after-edge")
        .attr("fill", "black");

    fadeIn(firstGen2026Label, 0.75);

    addTimeAxis(firstGenGraph, data.length);
}

export function addStage2 (svg, isVertical) {
    svg.select("#title").text("Admitted* class composition over time");

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

    widthIn(clipLeft1, graphWidth);

    widthIn(clipLeft2, graphWidth, delay + 300);

    addDemoGraph(stage2, defs, pomAdmStage2, hmcLabels, hmcColors, 1);
    addDemoGraph(stage2, defs, hmcDemographics, hmcLabels, hmcColors, 1, 3 * padding + 2 * graphWidth);
    addFirstGenGraph(stage2, defs, [...pomFirstGen].reverse());
    addFirstGenGraph(stage2, defs, [...hmcFirstGen].reverse(), 4 * padding + 3 * graphWidth);

    stage2.selectAll(".domain").style("display", "none");
}