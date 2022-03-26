export function removeStage(stage, svg, isVertical) {
    const duration = 500;

    svg.selectAll(`#stage${stage} .fadeOut`)
        .transition()
        .duration(duration)
        .style("opacity", 0)
        .remove();

    svg.selectAll(`#stage${stage} .widthOut`)
        .transition()
        .duration(duration)
        .attr("width", 0)
        .remove();

    svg.selectAll(`#stage${stage} .popOut`)
        .transition()
        .delay(duration)
        .remove();
}