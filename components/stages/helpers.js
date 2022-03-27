const d3 = require("d3");

export const padding = 32;
export const baseWidth = 600;
export const baseHeight = 600;
export const graphHeight = (baseWidth - 3 * padding) / 2; // 270
export const graphWidth = (baseWidth - 3 * padding) / 2;

export const percentageYScale = d3.scaleLinear().domain([0, 100]).range([0, graphHeight]);

export const pomLabels = ["White", "International", "Declined to state", "Latina/o", "Asian American", "Black", "Native American", "Multiracial"];

export const pomAdm = [
    [20.8, 14.4, 3.4, 17.9, 17.4, 15.5, 1.1, 9.5],
    [26.3, 15.8, 3.1, 17.2, 16, 11.8, 0.9, 8.9],
    [25.1, 13.6, 2.6, 19.3, 14.2, 17.9, 0.8, 6.6],
    [25.9, 13.5, 2.8, 19.8, 17.9, 13.6, 1.4, 5.1],
    [0, 32.2, 11.3, 17.8, 16.8, 12.8, 1.4, 7.7],
];

export const pomAdmStage2 = pomAdm.map(d => [d[0] + d[1] + d[2], d[4], d[5], d[3] + d[6] + d[7]]);

export const pomFirstGen = [23, 18.5, 20.7, 20.3, 19.2];

export const hmcLabelsOriginal = ["White", "International", "Unknown", "Asian American", "Black", "Latina/o", "American Indian or Alaska Native", "Native Hawaiian or Other Pacific Islander", "Two or More Races"];

const hmcDemographicsOriginal = [ // 2021 t0 2016
    [25.9,8.5,5.7,23.8,4.5,21.1,0.4,0.2,9.8],
    [27.7,7.4,6.7,23.0,4.1,20.3,0.2,0.4,10.3],
    [30.6,8.3,6.5,19.7,4.0,19.6,0.2,0.6,10.6],
    [31.3,9.7,5.7,18.8,3.5,19.8,0.2,0.4,10.6],
    [33.9,10.1,5.5,17.4,3.8,17.5,0.5,0.5,10.9],
    [35.6,11.1,4.8,19.4,3.0,15.8,0.4,0.4,9.5],
    [35.6,11.1,4.8,19.4,3.0,15.8,0.4,0.4,9.5],
    [38.2,13.0,4.8,20.4,2.2,12.8,0.5,0.1,8.1],
    [43.8,12.7,4.5,20.8,1.6,10.0,0.5,0.0,6.2],
    [47.2,11.4,4.8,22.1,1.2,9.0,0.2,0.0,4.0],
    [54.1,8.3,5.4,21.4,0.9,7.1,0.4,0.0,2.4],
    [58.4,7.1,4.1,20.7,1.3,6.4,0.6,0.0,1.4],
    [58.3,4.7,4.8,19.4,0.9,6.9,0.4,0.0,4.7],
];

export const hmcFirstGen = [20.5, 15.75, 11, 10]; // 15.75 is an artifically calculated average because no real data is available

export const hmcLabels = ["White, int'l or unknown", "Latina/o", "Black", "Other d. s. of color"];

export const hmcDemographics = [
    [30, 28.8, 10.1, 31.1],
    ...hmcDemographicsOriginal.map(d => [d[0] + d[1] + d[2], d[5], d[4], d[3] + d[6] + d[7] + d[8]]),
];

export const pomonaColors = ["#20438f","#734c8f","#a15d8a","#be7688","#cf948e","#dab3a0","#e3d2bd","#f1efe2"];

export const hmcColors = ["#2c4391","#c8948d","#d5b39f","#f0efe2"];

export const delay = 200;
export const duration = 500;

export function fadeIn(node, opacity = 1.0, delay = 200, duration = 500) {
    node
        .style("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", opacity)
}

export function widthIn(node, width = 64, delay = 200, duration = 500) {
    node
        .attr("width", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("width", width);
}

export function addLegend(node, labels, colors) {
    const legend = node.selectAll(".stage1DemLegend")
        .data(labels)
        .enter()
        .append("g")
        .attr("class", "fadeOut")
        .style("transform", (d, i) => `translate(0, ${graphHeight + padding + i * 24}px)`);

    legend.append("rect")
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", (d, i) => colors[i]);

    legend.append("text")
        .text(d => d)
        .attr("x", 28)
        .style("font-size", 12)
        .style("opacity", 0.5)
        .attr("dominant-baseline", "text-before-edge");

    fadeIn(legend);
}