import {
    graphHeight,
    graphWidth,
    padding,
    percentageYScale,
    pomAdm,
    pomonaColors,
    widthIn,
    delay,
    duration,
    pomFirstGen, fadeIn,
} from "./helpers";
const d3 = require("d3");

function addPomDemoGraph(stage2, defs) {
    const area = d3.area()
        .x((d, i, a) => i * (graphWidth / (a.length - 1)))
        .y0(d => percentageYScale(d[0]))
        .y1(d => percentageYScale(d[1]));

    const pomData = pomAdm.map(d => Object.fromEntries(d.map((d, i) => [i, d])));
    const pomPercPoc = pomAdm.map(d => [...d].splice(3).reduce((a, b) => a + b, 0));
    const pomStack = d3.stack(pomData).keys(Object.keys(pomData[0]))(pomData);

    const line = d3.line()(pomPercPoc.map((d, i) => [
        i * (graphWidth / (pomPercPoc.length - 1)),
        percentageYScale(100 - d),
    ]));

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

    const poc2026Line = pomDemoGraph.append("line")
        .attr("class", "fadeOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", percentageYScale(100 - 61.4))
        .attr("y2", percentageYScale(100 - 61.4))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", 4)
        .attr("fill", "none")
        .attr("stroke", "white");

    fadeIn(poc2026Line, 0.75);

    const poc2026Label = pomDemoGraph.append("text")
        .text("61.4%")
        .attr("class", "fadeOut")
        .attr("x", graphWidth - 8)
        .attr("y", percentageYScale(100 - 61.4) + 4)
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-before-edge")
        .attr("fill", "white");

    fadeIn(poc2026Label, 0.75);

    const poc50Label = pomDemoGraph.append("text")
        .text("50% d. s. of color")
        .attr("class", "fadeOut")
        .attr("x", 8)
        .attr("y", graphHeight / 2 + 4)
        .style("font-size", 12)
        .attr("dominant-baseline", "text-before-edge")
        .attr("fill", "white");

    fadeIn(poc50Label, 0.5);

    widthIn(clipLeft1, graphWidth);

    widthIn(clipLeft2, graphWidth, delay + 300);
}

function addPomFirstGenGraph(stage2, defs) {
    const area = d3.area()
        .x((d, i, a) => i * (graphWidth / (a.length - 1)))
        .y0(d => graphHeight)
        .y1(d => {
            console.log(d);
            return graphHeight - percentageYScale(d)
        });

    const line = d3.line()(pomFirstGen.map((d, i, a) => [
        i * (graphWidth / (a.length - 1)),
        graphHeight - percentageYScale(d),
    ]));

    const clipMidLeft = defs.append("clipPath")
        .attr("id", "clipMidLeft")
        .append("rect")
        .attr("class", "widthOut")
        .attr("width", 0)
        .attr("height", graphHeight);

    const pomFirstGenGraph = stage2.append("g")
        .attr("class", "popOut")
        .style("transform", `translate(${2 * padding + graphWidth}px, ${padding + 140}px)`);

    pomFirstGenGraph.append("rect")
        .attr("clip-path", "url(#clipMidLeft)")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .attr("fill", "#eee");

    pomFirstGenGraph.append("path")
        .attr("clip-path", "url(#clipMidLeft)")
        .attr("fill", pomonaColors[0])
        .attr("class", "popOut")
        .datum(pomFirstGen)
        .attr("d", area);

    const firstGen2026Line = pomFirstGenGraph
        .append("line")
        .attr("class", "fadeOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", percentageYScale(100 - pomFirstGen[0]))
        .attr("y2", percentageYScale(100 - pomFirstGen[0]))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", 4)
        .attr("fill", "none")
        .attr("stroke", "black");

    fadeIn(firstGen2026Line, 0.75);

    const firstGen2026Label = pomFirstGenGraph.append("text")
        .text(`${pomFirstGen[0]}%`)
        .attr("class", "fadeOut")
        .attr("x", graphWidth - 8)
        .attr("y", percentageYScale(100 - pomFirstGen[0]) - 4)
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-after-edge")
        .attr("fill", "black");

    fadeIn(firstGen2026Label, 0.75);

    widthIn(clipMidLeft, graphWidth);
}

export function addStage2 (svg, isVertical) {
    svg.select("#subtitle-slot-1").text("Admitted class composition over time");

    const stage2 = svg.append("g")
        .attr("id", "stage2")
        .attr("class", "popOut");

    const defs = stage2.append("defs").attr("class", "popOut");

    addPomDemoGraph(stage2, defs);

    addPomFirstGenGraph(stage2, defs);
}