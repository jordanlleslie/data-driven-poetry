import numeracyChart from "./utils/numeracyChart.js";
import pieChart from "./utils/pieChart.js";

let chart, chartWidth, chartHeight;
const svgWidth = 600;
const svgHeight = 400;
let svg = d3.select("#svg");

let discrimination_experiences, correction_reasons;

async function loadData() {
  discrimination_experiences = await d3.csv(
    "./assets/data/discrimination_experiences.csv"
  );
  correction_reasons = await d3.csv("./assets/data/correction_reasons.csv");
}

function initializeSVG() {
  svg
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("overflow", "visible");
  svg.selectAll("*").remove();

  const margin = { top: 40, right: 30, bottom: 50, left: 30 };
  chartWidth = svgWidth - margin.left - margin.right;
  chartHeight = svgHeight - margin.top - margin.bottom;

  chart = svg
    .append("g")
    .attr("id", "chart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

  // Add title
  svg
    .append("text")
    .attr("id", "chart-title")
    .attr("x", svgWidth / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("");
}

function updateTitle(title) {
  if (title.length > 0 && title !== svg.select("#chart-title").text()) {
    // TODO: Add transition
    svg.select("#chart-title").text(title);
  }
}

function buttons() {
  // update active chart selection buttons
  let activeButton = d3.select(".active-button");
  const buttons = d3.selectAll(".selection-btn");
  buttons.on("click", (e) => {
    // click on active selection should do nothing
    if (e.target.classList.contains("active-button")) return;
    e.target.classList.add("active-button");
    activeButton.classed("active-button", false);
    activeButton = d3.select(".active-button");
  });
}

function selectChart() {
  // temporary mechanism to toggle between charts
  buttons();
}

document.getElementById("select-pie").addEventListener("click", (e) => {
  if (e.target.classList.contains("active-button")) return;
  pieChartWrapper();
});

document.getElementById("select-numeracy").addEventListener("click", (e) => {
  if (e.target.classList.contains("active-button")) return;
  numeracyChartWrapper();
});

function numeracyChartWrapper() {
  initializeSVG();
  numeracyChart(chart);
}

function pieChartWrapper() {
  initializeSVG();
  updateTitle(
    "Self-reported reasons for correcting or not correcting students"
  );
  pieChart(correction_reasons, chartWidth, chartHeight, chart);
}

async function initialize() {
  await loadData();
  selectChart();
  numeracyChartWrapper();
}

initialize();

export {
  discrimination_experiences,
  svg,
  svgWidth,
  svgHeight,
  chartWidth,
  chartHeight,
};
