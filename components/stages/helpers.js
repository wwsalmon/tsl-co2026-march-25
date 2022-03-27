const d3 = require("d3");

export const padding = 32;
export const baseWidth = 600;
export const baseHeight = 600;
export const graphHeight = (baseWidth - 3 * padding) / 2; // 270
export const graphWidth = (baseWidth - 3 * padding) / 2;

export const percentageYScale = d3.scaleLinear().domain([0, 100]).range([0, graphHeight]);

export const pomLabels = ["White", "International", "Declined to state", "Asian American", "Black", "Latina/o", "Native American", "Multiracial"];

export const pomAdm = [
    [20.8, 14.4, 3.4, 17.4, 15.5, 17.9, 1.1, 9.5],
    [26.3, 15.8, 3.1, 16, 11.8, 17.2, 0.9, 8.9],
    [25.1, 13.6, 2.6, 14.2, 17.9, 19.3, 0.8, 6.6],
    [25.9, 13.5, 2.8, 17.9, 13.6, 19.8, 1.4, 5.1],
    [0, 32.2, 11.3, 16.8, 12.8, 17.8, 1.4, 7.7],
];

export const pomFirstGen = [23, 18.5, 20.7, 20.3, 19.2];

export const hmcLabelsOriginal = ["White", "International", "Unknown", "Asian American", "Black", "Latina/o", "American Indian or Alaska Native", "Native Hawaiian or Other Pacific Islander", "Two or More Races"];

const hmcDemographicsOriginal = [ // 2021 t0 2016
    [25.9,8.5,5.7,23.8,4.5,21.1,0.4,0.2,9.8],
    [27.7,7.4,6.7,23.0,4.1,20.3,0.2,0.4,10.3],
    [30.6,8.3,6.5,19.7,4.0,19.6,0.2,0.6,10.6],
    [31.3,9.7,5.7,18.8,3.5,19.8,0.2,0.4,10.6],
    [33.9,10.1,5.5,17.4,3.8,17.5,0.5,0.5,10.9],
    [35.6,11.1,4.8,19.4,3.0,15.8,0.4,0.4,9.5],
];

export const hmcLabels = ["White, int'l or unknown", "Black", "Latina/o", "Other d. s. of color"];

export const hmcDemographics = [
    [30, 10.1, 28.8, 31.1],
    ...hmcDemographicsOriginal.map(d => [d[0] + d[1] + d[2], d[4], d[5], d[3] + d[6] + d[7] + d[8]]),
];

export const pomonaColors = ["#20438f","#734c8f","#a15d8a","#be7688","#cf948e","#dab3a0","#e3d2bd","#f1efe2"];

export const hmcColors = ["#2c4391","#af6587","#d7aa98","#f0efe2"];

export const delay = 200;
export const duration = 500;

export function fadeIn(node, delay = 200, duration = 500) {
    node
        .style("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", 1.0)
}

export function widthIn(node, width = 64, delay = 200, duration = 500) {
    node
        .attr("width", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("width", width);
}