const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require("d3");
const {addStage1} = require("./stages/addStage1");
const {addStage2} = require("./stages/addStage2");
const {removeStage} = require("./stages/removeStage");
const {padding} = require("./stages/helpers");
const {baseHeight} = require("./stages/helpers");
const {baseWidth} = require("./stages/helpers");

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

    svg.append("text")
        .attr("id", "pomona-title")
        .text("Pomona")
        .attr("class", "font-lora")
        .attr("dominant-baseline", "text-before-edge")
        .attr("font-size", 36)
        .attr("x", padding)
        .attr("y", padding);

    svg.append("text")
        .attr("id", "hmc-title")
        .text("Harvey Mudd")
        .attr("class", "font-lora")
        .attr("dominant-baseline", "text-before-edge")
        .attr("font-size", 36)
        .attr("x", width / 2)
        .attr("y", padding);

    svg.append("text")
        .attr("id", "subtitle-slot-1")
        .text("Class of 2026")
        .style("font-weight", 700)
        .attr("dominant-baseline", "text-before-edge")
        .attr("font-size", 20)
        .attr("x", padding)
        .attr("y", padding  + 80);

    svg.append("text")
        .attr("id", "subtitle-slot-2")
        .text("Class of 2026")
        .style("font-weight", 700)
        .attr("dominant-baseline", "text-before-edge")
        .attr("font-size", 20)
        .attr("x", width / 2)
        .attr("y", padding  + 80);

    addStage1(svg, false);
  }

  update(props, oldProps) {
    const {state} = props;

    if (state === 1) {
      addStage1(this.svg, false);
    } else {
      removeStage(1, this.svg, false);
    }

    if (state === 2) {
      addStage2(this.svg, false);
    } else {
      removeStage(2, this.svg, false);
    }
  }
}

module.exports = CustomD3Component;
