let chart, chartWidth, chartHeight;

const svgWidth = 500;
const svgHeight = 400;

let xScale, yScale;

let svg = d3.select("#svg");

async function loadData() {
  return;
}

function initializeSVG() {
  svg.attr("width", svgWidth);
  svg.attr("height", svgHeight);
  svg.selectAll("*").remove();

  const margin = { top: 40, right: 30, bottom: 50, left: 50 };
  chartWidth = svgWidth - margin.left - margin.right;
  chartHeight = svgHeight - margin.top - margin.bottom;

  chart = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  xScale = d3.scaleBand().domain([]).range([0, chartWidth]).padding(0.1);
  yScale = d3.scaleLinear().domain([]).nice().range([chartHeight, 0]);

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

function makeNumeracyChart() {
  // implement interactive element (statement with forward and backward buttons)

  const fontSize = 18;

  chart
    .append("text")
    .attr("id", "discrimination-statement")
    .attr("x", svgWidth / 2)
    .text("Statement")
    .style("font-size", `${fontSize}px`);

  chart
    .append("image")
    .attr("xlink:href", "/assets/images/Right.svg")
    .attr("width", fontSize)
    .attr("id", "next-statement")
    // Click listener
    .on("click", () => {
      //   NEXT STATEMENT
    });

  chart
    .append("image")
    .attr("xlink:href", "/assets/images/Left.svg")
    .attr("width", fontSize)
    .attr("id", "next-statement")
    // Click listener
    .on("click", () => {
      //   NEXT STATEMENT
    });

  // implement chart
  // implement legend with encodings
}

async function initialize() {
  initializeSVG();
  await loadData();
  makeNumeracyChart();
}

initialize();
