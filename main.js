let chart, chartWidth, chartHeight;
let xScale, yScale;

const svgWidth = 500;
const svgHeight = 400;

let discrimination_experiences;

let svg = d3.select("#svg");

async function loadData() {
  discrimination_experiences = await d3.csv(
    "/assets/data/discrimination_experiences.csv"
  );
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

function singleNumeracyChart(statement) {
  svg.selectAll(".discrimination-icon").remove();
  svg.select("#discrimination-statement").text(statement);

  let row = discrimination_experiences.filter(
    (entry) => entry["Experiences of discrimination"] === statement
  );

  //  if filter returns no rows, something went wrong
  if (!row[0]) throw Error("No matching statement...something went wrong");
  row = row[0];

  console.log(row);
  for (key of ["All", "Low prestige", "High prestige"]) {
    value = parseInt(row[key]);
    // TODO: Adjust position for different categories so we can compare them
    // TODO: Figure out how to change fill color of SVG
    for (i = 0; i < value; i++) {
      chart
        .append("image")
        .attr("xlink:href", "/assets/images/Person.svg")
        .attr("width", "15px")
        .attr("class", "discrimination-icon")
        .style("fill", "red")
        .attr("x", (i % 10) * 15)
        .attr("y", Math.floor(i / 10) * 15);
    }
  }
}

function makeNumeracyChart() {
  // implement interactive element (statement with forward and backward buttons)

  const fontSize = 25;
  const padding = fontSize / 2;

  // get discrimination statements from data
  const statements = discrimination_experiences.map(
    (entry) => entry["Experiences of discrimination"]
  );
  console.log(statements);
  //   start with first statement
  let statementIndex = 0;

  // statement
  chart
    .append("text")
    .attr("id", "discrimination-statement")
    .attr("x", chartWidth / 2)
    .text(statements[statementIndex])
    .attr("text-anchor", "middle")
    .style("font-size", `${fontSize}px`);

  singleNumeracyChart(statements[statementIndex]);

  // prev, next buttons
  svg
    .append("image")
    .attr("xlink:href", "/assets/images/Right.svg")
    .attr("width", fontSize)
    .attr("id", "next-statement-btn")
    .attr("x", svgWidth - padding * 3)
    .attr("y", padding)
    // Click listener
    .on("click", () => {
      if (statementIndex < statements.length - 1) {
        statementIndex++;
        singleNumeracyChart(statements[statementIndex]);
      }
    });
  svg
    .append("image")
    .attr("xlink:href", "/assets/images/Left.svg")
    .attr("width", fontSize)
    .attr("id", "prev-statement-btn")
    .attr("x", padding)
    .attr("y", padding)
    // Click listener
    .on("click", () => {
      if (statementIndex > 0) {
        statementIndex--;
        singleNumeracyChart(statements[statementIndex]);
      }
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
