const d3 = require("d3");
import {
    fadeIn,
    graphHeight,
    graphWidth,
    padding,
    percentageYScale,
    pomAdm, pomFirstGen,
    pomLabels,
    pomonaColors,
    widthIn,
    delay,
    duration,
} from "./helpers";

export function addStage1 (svg, isVertical) {
    // POMONA 2026 DEMOGRAPHICS
    const pom2026 = [Object.fromEntries(pomAdm[0].map((d, i) => [i, d]))];
    const pom2026PercPoc = [...pomAdm[0]].splice(3).reduce((a, b) => a + b, 0);
    const pom2026stack = d3.stack().keys([...Array(pomAdm[0].length).keys()])(pom2026).map(d => d[0]);

    svg.select("#subtitle-slot-1").text("Class of 2026");

    const stage1 = svg.append("g")
        .attr("id", "stage1")
        .attr("class", "popOut");

    const pomDemGraph = stage1.append("g")
        .attr("class", "popOut")
        .style("transform", `translate(${padding}px, ${padding + 140}px)`);

    const pomDemRect = pomDemGraph.selectAll(".stage1PomDemRect")
        .data(pom2026stack)
        .enter()
        .append("rect")
        .attr("class", "stage1PomDemRect widthOut")
        .attr("x", 0)
        .attr("y", d => percentageYScale(d[0]))
        .attr("height", d => percentageYScale(d[1] - d[0]))
        .attr("fill", (d, i) => pomonaColors[i]);

    widthIn(pomDemRect);

    pomDemGraph.selectAll(".stage1PomDemLine")
        .data(pom2026stack)
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

    pomDemGraph.selectAll(".stage1PomDemLabel")
        .data(pom2026stack)
        .enter()
        .append("text")
        .attr("class", "stage1PomDemLabel fadeOut")
        .text((d, i) => (d[1] - d[0]) > 5 ? `${pomLabels[i]}: ${pomAdm[0][i]}%` : "")
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-after-edge")
        .attr("x", graphWidth)
        .attr("y", d => percentageYScale(d[1]))
        .style("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", 0.25);

    const pocLineY = percentageYScale(100 - pom2026PercPoc);

    const stage1PocLine = pomDemGraph.append("line")
        .attr("class", "fadeOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", pocLineY)
        .attr("y2", pocLineY)
        .attr("stroke-width", 2)
        .attr("stroke", "black");

    fadeIn(stage1PocLine);

    const stage1PocLabel = pomDemGraph.append("text")
        .attr("class", "fadeOut")
        .text(`D. s. of color: ${pom2026PercPoc}%`)
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-before-edge")
        .attr("x", graphWidth)
        .attr("y", pocLineY + 4);

    fadeIn(stage1PocLabel);

    const pomFirstGenGroup = stage1.append("g")
        .attr("class", "popOut")
        .style("transform", `translate(${2 * padding + graphWidth}px, ${padding + 140}px)`);

    const pomFirstGenRect1 = pomFirstGenGroup.append("rect")
        .attr("height", graphHeight)
        .attr("fill", "#2c4391")
        .attr("class", "widthOut");

    widthIn(pomFirstGenRect1);

    const pomFirstGenRect2 = pomFirstGenGroup.append("rect")
        .attr("height", percentageYScale(100 - pomFirstGen[0]))
        .attr("fill", "#eee")
        .attr("class", "widthOut");

    widthIn(pomFirstGenRect2);

    const pomFirstGenLine = pomFirstGenGroup.append("line")
        .attr("class", "fadeOut")
        .attr("x1", 0)
        .attr("x2", graphWidth)
        .attr("y1", percentageYScale(100 - pomFirstGen[0]))
        .attr("y2", percentageYScale(100 - pomFirstGen[0]))
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("stroke", "black");

    fadeIn(pomFirstGenLine);

    const pomFirstGenLabel = pomFirstGenGroup.append("text")
        .text(`First-gen students: ${pomFirstGen[0]}%`)
        .attr("class", "fadeOut")
        .attr("x", graphWidth)
        .attr("y", percentageYScale(100 - pomFirstGen[0]) + 4)
        .style("font-size", 12)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "text-before-edge")
        .attr("fill", "black");

    fadeIn(pomFirstGenLabel);
}