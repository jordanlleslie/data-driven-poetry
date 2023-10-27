import Person from "./assets/images/Person.js";
import pieChart from "./utils/pieChart.js";

let chart, chartWidth, chartHeight;
const svgWidth = 600;
const svgHeight = 400;

let discrimination_experiences, correction_reasons;

let svg = d3.select("#svg");

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

/*
NUMERACY CHART: EXPERIENCES OF DISCRIMINATION VS. LANGUAGE PRESTIGE
TODO: Move this to another file
*/

function singleNumeracyChart(statement) {
  const rowSize = 8;
  const padding = 5;
  const iconSize = chartWidth / (rowSize * 2);

  // TODO: Add animation for transitions
  svg.selectAll(".discrimination-icon").remove();
  svg.select("#discrimination-statement").text(statement);

  let row = discrimination_experiences.filter(
    (entry) => entry["Experiences of discrimination"] === statement
  );

  //  if filter returns no rows, something went wrong
  if (!row[0]) {
    e = Error("No matching statement...something went wrong");
    console.error(e);
  }
  row = row[0];

  const colors = {
    "Low prestige": "#FFC107",
    "High prestige": "#1E88E5",
  };

  let xPosition = 0;
  for (let key of ["Low prestige", "High prestige"]) {
    let value = parseInt(row[key]);
    // group icons together
    const category = chart
      .append("g")
      .attr("class", "numeracy-category")
      .attr("width", rowSize * iconSize);

    // add icons
    for (let i = 0; i < value; i++) {
      category
        .append("svg")
        .attr("class", "discrimination-icon")
        .html(Person(colors[key], iconSize, padding))
        .attr("x", xPosition + (i % rowSize) * iconSize)
        .attr("y", chartHeight - Math.floor(i / rowSize + 2) * iconSize);
    }
    // Add hidden label
    category
      .append("text")
      .attr("class", "label")
      .text(value)
      .attr("y", chartHeight - padding * 3)
      .attr("x", xPosition)
      .style("visibility", "hidden")
      .style("fill", colors[key]);
    // Show label when hovering
    // TODO: fix this to only show the corresponding label
    category
      .on("mouseover", () => {
        category.selectAll(".label").style("visibility", "visible");
      })
      .on("mouseout", () => {
        category.selectAll(".label").style("visibility", "hidden");
      });
    xPosition += rowSize * iconSize;
  }
}
//   start with first statement
let statementIndex;
let statements;

function interactiveNumeracyChart() {
  // updateTitle("Experiences of Linguistic Discrimination in Germany");

  // implement interactive element (statement with forward and backward buttons)
  const buttonSize = 32;
  const padding = buttonSize / 4;
  // get discrimination statements from data
  statementIndex = 0;
  statements = discrimination_experiences.map(
    (entry) => entry["Experiences of discrimination"]
  );

  svg
    .append("g")
    .attr("id", "statement-selector")
    .attr("transform", `translate(0, ${padding})`);

  // statement
  const statementSelector = svg.select("#statement-selector");
  statementSelector
    .append("foreignObject")
    .attr("id", "discrimination-statement")
    .attr("width", svgWidth - buttonSize * 4)
    .attr("height", 100)
    .attr("x", buttonSize * 2)
    .attr("y", padding)
    .append("xhtml:body")
    .html(`<p>${statements[statementIndex]}</p>`);

  // prev, next buttons
  statementSelector
    .append("image")
    .attr("xlink:href", "/assets/images/Right.svg")
    .attr("width", buttonSize)
    .attr("id", "next-statement-btn")
    .attr("x", svgWidth - buttonSize - padding);

  statementSelector
    .append("image")
    .attr("xlink:href", "/assets/images/Left.svg")
    .attr("width", buttonSize)
    .attr("id", "prev-statement-btn")
    .attr("x", padding);

  // implement chart
  singleNumeracyChart(statements[statementIndex]);

  chart
    .append("text")
    .text("low prestige language")
    .attr("y", chartHeight)
    .attr("x", chartWidth / 4)
    .attr("text-anchor", "middle");
  chart
    .append("text")
    .text("high prestige language")
    .attr("y", chartHeight)
    .attr("x", (3 * chartWidth) / 4)
    .attr("text-anchor", "middle");

  updateButtons(statementIndex, statements);
}

// Helper functions to enable/disable numeracy chart statement buttons based on index
function updateButtons(index, statements) {
  // const prevBtn = d3.select("#prev-statement-btn");
  // const nextBtn = d3.select("#next-statement-btn");
  const prevBtn = d3.select("#prev-statement-btn");
  const nextBtn = d3.select("#next-statement-btn");
  if (index === 0) {
    disableButton(prevBtn);
    enableButton(nextBtn, "next");
  } else if (index === statements.length - 1) {
    disableButton(nextBtn);
    enableButton(prevBtn, "prev");
  } else {
    enableButton(prevBtn, "prev");
    enableButton(nextBtn, "next");
  }
}

function disableButton(button) {
  button.on("click", null).classed("disabled-btn", true);
}

function enableButton(button, id) {
  button.classed("disabled-btn", false);
  if (id === "prev") {
    button.on("click", () => {
      if (statementIndex > 0) {
        statementIndex--;
        d3.selectAll(".label").remove();
        singleNumeracyChart(statements[statementIndex]);
        updateButtons(statementIndex, statements);
      }
    });
  } else if (id === "next") {
    button.on("click", () => {
      if (statementIndex < statements.length - 1) {
        statementIndex++;
        d3.selectAll(".label").remove();
        singleNumeracyChart(statements[statementIndex]);
        updateButtons(statementIndex, statements);
      }
    });
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

function pieChartWrapper() {
  updateTitle(
    "Self-reported reasons for correcting or not correcting students"
  );
  pieChart(correction_reasons, chartWidth, chartHeight, chart);
}

async function initialize() {
  initializeSVG();
  selectChart();
  await loadData();
  // interactiveNumeracyChart();
  pieChartWrapper();
}

initialize();
