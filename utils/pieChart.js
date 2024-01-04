/*
PIE CHART: REASONS FOR CORRECTING STUDENTS
*/

function addArcs(chart, arcs, chart_x, chartHeight, arcGenerator, data) {
  // Helper function to add arcs to pie chart

  // Group label and arc together so event listeners are the same
  let group = chart
    .append("g")
    .attr("class", "pie-chart")
    .on("click", (e) => {
      // Prevent function call when active chart is clicked a 2nd time
      if (
        !e.target.parentNode.classList.contains("inactive-pie") &&
        document.querySelectorAll(".inactive-pie").length > 0
      ) {
        return;
      }
      const correct_or_not = e.target.__data__.data.make_correct;
      makeTable(
        chart,
        data.sort((a, b) =>
          a["linguistic_feature"] > b["linguistic_feature"] ? 1 : -1
        ),
        correct_or_not
      );
      d3.selectAll(".pie-chart").classed("inactive-pie", true);
      group.classed("inactive-pie", false);
    })
    .on("mouseover", (e) => {
      e.target.parentNode.classList.add("pie-hovered");
    })
    .on("mouseout", (e) => {
      e.target.parentNode.classList.remove("pie-hovered");
    });

  // Add arcs
  group
    .selectAll()
    .data(arcs)
    .enter()
    .append("path")
    .attr("class", "pie-slice")
    .attr("transform", "translate(" + chart_x + "," + chartHeight / 2 + ")")
    .attr("fill", (d) => d.data.color)
    .attr("d", arcGenerator);

  // Add labels
  group
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
  chart.append("g").attr("id", "pie-legend");

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

function formatData(pedagogical, social, make_correction) {
  const pedagogical_color = "#D55E00";
  const social_color = "#0072B2";
  const total = pedagogical + social;
  const fdata = [
    {
      make_correct: make_correction,
      reason: "Pedagogical",
      percent: pedagogical / total,
      color: pedagogical_color,
    },
    {
      make_correct: make_correction,
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

  const finalData = formatData(pedagogical, social, make_correction);
  return finalData;
}

function makeTable(chart, data, correct_or_not) {
  const chartWidth = chart.attr("width");
  const filtered_data = data.filter(
    (x) => x["make_correction"] === correct_or_not
  );
  d3.select("#table").remove();
  d3.select("#table-header").remove();

  const header = chart
    .append("g")
    .attr("id", "table-header")
    .attr("transform", "translate(0,450)");

  header.append("text").text("% Positive reason").attr("x", 0);
  header.append("text").text("% Negative reason").attr("x", 160);
  header.append("text").text("Linguistic feature").attr("x", 350);

  header
    .append("text")
    .text("close")
    .attr("class", "close-btn")
    .attr("x", chartWidth)
    .attr("text-anchor", "end")
    .on("click", () => {
      d3.select("#table").remove();
      d3.select("#table-header").remove();
      d3.selectAll(".pie-chart").classed("inactive-pie", false);
    });

  header
    .append("rect")
    .attr("y", 10)
    .attr("height", 2)
    .attr("width", chartWidth);

  const table = chart
    .append("g")
    .attr("id", "table")
    .attr("transform", "translate(0,450)");

  const rows = table
    .selectAll()
    .data(filtered_data)
    .enter()
    .append("g")
    .attr("class", "table-row");

  rows
    .append("rect")
    .attr("y", (d, i) => i * 30 + 25)
    .attr("height", 20)
    .attr("width", (d) => parseInt(d["positive_reason"]) * 2)
    .attr("opacity", 0.4)
    .attr("fill", "#009E73");

  rows
    .append("text")
    .text((d) => parseFloat(d["positive_reason"]).toFixed(1) + "%")
    .attr("x", 2)
    .attr("class", "table-text")
    .attr("y", (d, i) => i * 30 + 41)
    .attr("fill", "black");

  rows
    .append("rect")
    .attr("x", 160)
    .attr("y", (d, i) => i * 30 + 25)
    .attr("height", 20)
    .attr("width", (d) => parseInt(d["negative_reason"]) * 1.5)
    .attr("opacity", 0.2);
  rows
    .append("text")
    .text((d) => parseFloat(d["negative_reason"]).toFixed(1) + "%")
    .attr("x", 2 + 160)
    .attr("class", "table-text")
    .attr("y", (d, i) => i * 30 + 41)
    .attr("fill", "black");

  rows
    .append("text")
    .text((d) => d["linguistic_feature"])
    .attr("x", 2 + 350)
    .attr("class", "table-text")
    .attr("y", (d, i) => i * 30 + 41)
    .attr("fill", "black");
}

function pieChart(correction_reasons, chartWidth, chartHeight, chart) {
  // x position for charts
  const x1 = chartWidth / 4;
  const x2 = (3 * chartWidth) / 4;

  const radius = Math.min(chartWidth, chartHeight) / 4;
  const pie = d3.pie().value((d) => d.percent);

  //   convert into datasets for two charts
  const correct_data = processData(correction_reasons, "y");
  const no_correct_data = processData(correction_reasons, "n");

  let arcs = pie(correct_data);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  addArcs(chart, arcs, x1, chartHeight, arcGenerator, correction_reasons);
  // labelArcs(chart, arcs, arcGenerator, chartHeight, x1);
  labelChart(chart, x1, chartHeight, "Corrected");

  arcs = pie(no_correct_data);

  addArcs(chart, arcs, x2, chartHeight, arcGenerator, correction_reasons);
  // labelArcs(chart, arcs, arcGenerator, chartHeight, x2);
  labelChart(chart, x2, chartHeight, "Did not correct");

  makeLegend(chart, chartHeight, arcs);
}

export default pieChart;
