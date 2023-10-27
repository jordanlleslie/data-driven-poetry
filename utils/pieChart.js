/*
PIE CHART: REASONS FOR CORRECTING STUDENTS
*/

function labelArcs(chart, arcs, arcGenerator, chartHeight, chart_x) {
  // Helper function to add value labels to pie chart
  chart
    .selectAll()
    .data(arcs)
    .enter()
    .append("text")
    .text((d) => d.data.percent.toFixed(2) * 100)
    .attr("class", "pie-label")
    .attr("fill", "white")
    .attr("transform", (d) => {
      // adjust x and y values for labels to center of pie chart, then to correct arc
      let translation = arcGenerator.centroid(d);
      translation[0] += chart_x;
      translation[1] += chartHeight / 2;
      return `translate(${translation})`;
    })
    .style("text-anchor", "middle");
}

function addArcs(chart, arcs, chart_x, chartHeight, arcGenerator) {
  // Helper function to add arcs to pie chart
  chart
    .selectAll()
    .data(arcs)
    .enter()
    .append("path")
    .attr("class", "pie-slice")
    .attr("transform", "translate(" + chart_x + "," + chartHeight / 2 + ")")
    .attr("d", arcGenerator)
    .attr("fill", (d) => d.data.color);
}

function labelChart(chart, chart_x, chartHeight, text) {
  const spacing = 50;
  chart
    .append("text")
    .text(text)
    .attr("y", chartHeight - spacing)
    .attr("x", chart_x)
    .attr("text-anchor", "middle")
    .attr("class", "pie-title");
}

function makeLegend(chart, chartHeight, arcs) {
  // Make legend for pie chart
  const spacing = 30;
  const radius = 8;

  //   group svg elements so they can be manipulated with CSS
  chart
    .append("g")
    .attr("id", "pie-legend")
    .attr("x", 0)
    .attr("y", chartHeight);

  const legend = d3.select("#pie-legend");

  //   text labels
  legend
    .selectAll()
    .data(arcs)
    .enter()
    .append("text")
    .text((d) => d.data.reason)
    .attr("class", "legend-label")
    .attr("x", 2 * radius)
    .attr("y", (d, i) => chartHeight - spacing * i)
    .attr("fill", (d) => d.data.color);

  // color markers
  legend
    .selectAll()
    .data(arcs)
    .enter()
    .append("circle")
    .attr("class", "legend-dot")
    .attr("x", 0)
    .attr("y", (d, i) => chartHeight - spacing * i)
    .attr("cx", 0)
    .attr("cy", (d, i) => chartHeight - spacing * i - radius / 2)
    .attr("r", radius)
    .attr("fill", (d) => d.data.color);
}

function formatData(pedagogical, social) {
  const pedagogical_color = "#D55E00";
  const social_color = "#0072B2";
  const total = pedagogical + social;
  const fdata = [
    {
      make_correct: "y",
      reason: "Pedagogical",
      percent: pedagogical / total,
      color: pedagogical_color,
    },
    {
      make_correct: "y",
      reason: "Social",
      percent: social / total,
      color: social_color,
    },
  ];
  return fdata;
}

function processData(data, make_correction) {
  // Convert to formatted aggregate data
  const filtered = data.filter((x) => x["make_correction"] === make_correction);
  const pedagogical = filtered
    .map((x) => parseFloat(x["positive_pedagogical"]))
    .reduce((x1, x2) => x1 + x2);

  const social = filtered
    .map((x) => parseFloat(x["positive_social"]))
    .reduce((x1, x2) => x1 + x2);

  const finalData = formatData(pedagogical, social);
  return finalData;
}

function pieChart(correction_reasons, chartWidth, chartHeight, chart) {
  // x position for charts
  const x1 = chartWidth / 3;
  const x2 = (2 * chartWidth) / 3;

  const radius = Math.min(chartWidth, chartHeight) / 4;
  const pie = d3.pie().value((d) => d.percent);

  //   convert into datasets for two charts
  const correct_data = processData(correction_reasons, "y");
  const no_correct_data = processData(correction_reasons, "n");

  let arcs = pie(correct_data);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  addArcs(chart, arcs, x1, chartHeight, arcGenerator);
  labelArcs(chart, arcs, arcGenerator, chartHeight, x1);
  labelChart(chart, x1, chartHeight, "Corrected");

  arcs = pie(no_correct_data);

  addArcs(chart, arcs, x2, chartHeight, arcGenerator);
  labelArcs(chart, arcs, arcGenerator, chartHeight, x2);
  labelChart(chart, x2, chartHeight, "Did not correct");

  makeLegend(chart, chartHeight, arcs);
}

export default pieChart;
