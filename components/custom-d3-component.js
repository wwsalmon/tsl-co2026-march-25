const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const padding = 32;
const baseWidth = 600;
const baseHeight = 600;
const graphHeight = (baseWidth - 3 * padding) / 2; // 270
const graphWidth = (baseWidth - 3 * padding) / 2;

const percentageYScale = d3.scaleLinear().domain([0, 100]).range([0, graphHeight]);

const pomLabels = ["White", "International", "Declined to state", "Asian American", "Black", "Latina/o", "Native American", "Multiracial"];

const pomAdm = [
    [20.8, 14.4, 3.4, 17.4, 15.5, 17.9, 1.1, 9.5],
    [26.3, 15.8, 3.1, 16, 11.8, 17.2, 0.9, 8.9],
    [25.1, 13.6, 2.6, 14.2, 17.9, 19.3, 0.8, 6.6],
    [25.9, 13.5, 2.8, 17.9, 13.6, 19.8, 1.4, 5.1],
    [0, 32.2, 11.3, 16.8, 12.8, 17.8, 1.4, 7.7],
];

const pomFirstGen = [23, 18.5, 20.7, 20.3, 19.2];

const hmcLabelsOriginal = ["White", "International", "Unknown", "Asian American", "Black", "Latina/o", "American Indian or Alaska Native", "Native Hawaiian or Other Pacific Islander", "Two or More Races"];

const hmcDemographicsOriginal = [ // 2021 t0 2016
  [25.9,8.5,5.7,23.8,4.5,21.1,0.4,0.2,9.8],
  [27.7,7.4,6.7,23.0,4.1,20.3,0.2,0.4,10.3],
  [30.6,8.3,6.5,19.7,4.0,19.6,0.2,0.6,10.6],
  [31.3,9.7,5.7,18.8,3.5,19.8,0.2,0.4,10.6],
  [33.9,10.1,5.5,17.4,3.8,17.5,0.5,0.5,10.9],
  [35.6,11.1,4.8,19.4,3.0,15.8,0.4,0.4,9.5],
];

const hmcLabels = ["White, int'l or unknown", "Black", "Latina/o", "Other d. s. of color"];

const hmcDemographics = [
    [30, 10.1, 28.8, 31.1],
    ...hmcDemographicsOriginal.map(d => [d[0] + d[1] + d[2], d[4], d[5], d[3] + d[6] + d[7] + d[8]]),
];

const pomonaColors = ["#20438f","#734c8f","#a15d8a","#be7688","#cf948e","#dab3a0","#e3d2bd","#f1efe2"];

const hmcColors = ["#2c4391","#af6587","#d7aa98","#f0efe2"];

function fadeIn(node, delay = 200, duration = 500) {
  node
      .style("opacity", 0)
      .transition()
      .delay(delay)
      .duration(duration)
      .style("opacity", 1.0)
}

function widthIn(node, delay = 200, duration = 500) {
  node
      .attr("width", 0)
      .transition()
      .delay(delay)
      .duration(duration)
      .attr("width", 64)
}

function addStage1 (svg, isVertical) {
  const delay = 200;
  const duration = 500;

  // POMONA 2026 DEMOGRAPHICS
  const pom2026 = [Object.fromEntries(pomAdm[0].map((d, i) => [i, d]))];
  const pom2026PercPoc = [...pomAdm[0]].splice(3).reduce((a, b) => a + b, 0);
  const pom2026stack = d3.stack().keys([...Array(pomAdm[0].length).keys()])(pom2026).map(d => d[0]);

  svg.select("#subtitle-slot-1").text("Class of 2026");

  const pomDemGraph = svg.append("g")
      .attr("class", "stage1PopOut")
      .style("transform", `translate(${padding}px, ${padding + 140}px)`);

  const pomDemRect = pomDemGraph.selectAll(".stage1PomDemRect")
      .data(pom2026stack)
      .enter()
      .append("rect")
      .attr("class", "stage1PomDemRect")
      .attr("x", 0)
      .attr("y", d => percentageYScale(d[0]))
      .attr("height", d => percentageYScale(d[1] - d[0]))
      .attr("width", 0)
      .attr("fill", (d, i) => pomonaColors[i]);

  widthIn(pomDemRect);

  pomDemGraph.selectAll(".stage1PomDemLine")
      .data(pom2026stack)
      .enter()
      .append("line")
      .attr("class", "stage1PomDemLine stage1FadeOut")
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
      .attr("class", "stage1PomDemLabel stage1FadeOut")
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
      .attr("class", "stage1FadeOut")
      .attr("x1", 0)
      .attr("x2", graphWidth)
      .attr("y1", pocLineY)
      .attr("y2", pocLineY)
      .attr("stroke-width", 2)
      .attr("stroke", "black");

  fadeIn(stage1PocLine);

  const stage1PocLabel = pomDemGraph.append("text")
      .attr("class", "stage1FadeOut")
      .text(`D. s. of color: ${pom2026PercPoc}%`)
      .style("font-size", 12)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "text-before-edge")
      .attr("x", graphWidth)
      .attr("y", pocLineY + 4);

  fadeIn(stage1PocLabel);

  const pomFirstGenGroup = svg.append("g")
      .attr("class", "stage1PopOut")
      .style("transform", `translate(${2 * padding + graphWidth}px, ${padding + 140}px)`);

  const pomFirstGenRect1 = pomFirstGenGroup.append("rect")
      .attr("height", graphHeight)
      .attr("fill", "#2c4391")
      .attr("class", "stage1WidthOut");

  widthIn(pomFirstGenRect1);

  const pomFirstGenRect2 = pomFirstGenGroup.append("rect")
      .attr("height", percentageYScale(100 - pomFirstGen[0]))
      .attr("fill", "#eee")
      .attr("class", "stage1WidthOut");

  widthIn(pomFirstGenRect2);

  const pomFirstGenLine = pomFirstGenGroup.append("line")
      .attr("class", "stage1FadeOut")
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
      .attr("class", "stage1FadeOut")
      .attr("x", graphWidth)
      .attr("y", percentageYScale(100 - pomFirstGen[0]) + 4)
      .style("font-size", 12)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "text-before-edge")
      .attr("fill", "black");

  fadeIn(pomFirstGenLabel);
}

function removeStage1(svg, isVertical) {
  const duration = 500;

  svg.selectAll(".stage1FadeOut")
      .transition()
      .duration(duration)
      .style("opacity", 0)
      .remove();

  svg.selectAll(".stage1WidthOut")
      .transition()
      .duration(duration)
      .attr("width", 0)
      .remove();

  svg.selectAll(".stage1PopOut")
      .transition()
      .delay(duration)
      .remove();
}

function addStage2 (svg, isVertical) {
  const delay = 200;
  const duration = 500;
  const pomData = pomAdm.map(d => Object.fromEntries(d.map((d, i) => [i, d])));
  const pomPercPoc = pomAdm.map(d => [...d].splice(3).reduce((a, b) => a + b, 0));
  const pomStack = d3.stack(pomData).keys(Object.keys(pomData[0]))(pomData);

  svg.select("#subtitle-slot-1").text("Admitted class composition over time");

  const area = d3.area()
      .x((d, i) => padding + i * (graphWidth / (pomAdm.length - 1)))
      .y0(d => padding + percentageYScale(d[0]) + 140)
      .y1(d => padding + percentageYScale(d[1]) + 140);

  const line = d3.line()(pomPercPoc.map((d, i) => [
      padding + i * (graphWidth / (pomAdm.length - 1)),
      padding + percentageYScale(100 - d) + 140,
  ]));

  svg.selectAll(".stage2PomArea")
      .data(pomStack)
      .enter()
      .append("path")
      .attr("fill", (d, i) => pomonaColors[i])
      .attr("class", "stage2PomArea")
      .attr("d", area)
      .attr("clip-path", "url(#stage2Left)");

  svg.append("path")
      .attr("d", line)
      .attr("class", "stage2PomPocLine")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("clip-path", "url(#stage2Left2)");

  svg.append("line")
      .attr("x1", padding)
      .attr("x2", padding + graphWidth)
      .attr("y1", padding + 140 + graphWidth / 2)
      .attr("y2", padding + 140 + graphWidth / 2)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", 4)
      .attr("fill", "none")
      .attr("stroke", "white")
      .style("opacity", 0.5)
      .attr("clip-path", "url(#stage2Left2)");

  svg.select("#stage2Left rect")
      .attr("width", 0)
      .transition()
      .delay(delay)
      .duration(duration)
      .attr("width", graphWidth);

  svg.select("#stage2Left2 rect")
      .attr("width", 0)
      .transition()
      .delay(delay + 300)
      .duration(duration)
      .attr("width", graphWidth);

  svg.append("text")
      .text("50% d. s. of color")
      .attr("class", "stage2Label")
      .attr("x", padding + 8)
      .attr("y", padding + 140 + graphHeight / 2 + 4)
      .style("font-size", 12)
      .attr("dominant-baseline", "text-before-edge")
      .attr("fill", "white")
      .style("opacity", 0)
      .transition()
      .delay(delay + 300)
      .duration(duration)
      .style("opacity", 0.5);
}

function removeStage2(svg, isVertical) {
  const duration = 500;

  svg.select("#stage2Left2 rect")
      .attr("width", graphWidth)
      .transition()
      .duration(duration)
      .attr("width", 0);

  svg.select("#stage2Left rect")
      .attr("width", graphWidth)
      .transition()
      .duration(duration)
      .attr("width", 0);

  svg.selectAll(".stage2PomArea, .stage2PomPocLine, .stage2PomPocLine, .stage2Label")
      .transition()
      .delay(duration)
      .remove();
}

class CustomD3Component extends D3Component {
  initialize(node, props) {
    const svg = (this.svg = d3.select(node).append('svg'));
    const isVertical = window.innerWidth / window.innerHeight < 1;
    const width = (this.width = baseWidth * (2 - +isVertical));
    const height = (this.height = baseHeight * (1 + +isVertical));

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', '100vh');

    const defs = svg.append("defs");

    defs.append("clipPath")
        .attr("id", "stage2Left")
        .append("rect")
        .attr("x", padding)
        .attr("y", padding + 140)
        .attr("width", 0)
        .attr("height", graphHeight);

    defs.append("clipPath")
        .attr("id", "stage2Left2")
        .append("rect")
        .attr("x", padding)
        .attr("y", padding + 140)
        .attr("width", 0)
        .attr("height", graphHeight);

    defs.append("clipPath")
        .attr("id", "stage2MidLeft")
        .append("rect")
        .attr("x", 2 * padding + graphWidth)
        .attr("y", padding + 140)
        .attr("width", 0)
        .attr("height", graphHeight);

    svg.append("text")
        .attr("id", "pomona-title")
        .text("Pomona")
        .attr("class", "font-lora")
        .attr("dominant-baseline", "text-before-edge")
        .attr("font-size", 48)
        .attr("x", padding)
        .attr("y", padding);

    svg.append("text")
        .attr("id", "subtitle-slot-1")
        .text("Class of 2026")
        .style("font-weight", 700)
        .attr("dominant-baseline", "text-before-edge")
        .attr("font-size", 20)
        .attr("x", padding)
        .attr("y", padding  + 80);

    addStage1(svg, false);
  }

  update(props, oldProps) {
    const {state} = props;

    if (state === 1) {
      addStage1(this.svg, false);
    } else {
      removeStage1(this.svg, false);
    }

    if (state === 2) {
      addStage2(this.svg, false);
    } else {
      removeStage2(this.svg, false);
    }
  }
}

module.exports = CustomD3Component;
