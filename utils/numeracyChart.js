/*
NUMERACY CHART: EXPERIENCES OF DISCRIMINATION VS. LANGUAGE PRESTIGE
*/

import Person from "../assets/images/Person.js";
import {
  discrimination_experiences,
  svg,
  svgWidth,
  chartWidth,
  chartHeight,
  rightArrow,
  leftArrow,
} from "../main.js";

// Helper functions to enable/disable numeracy chart statement buttons based on index
function updateButtons(index, statements, chart) {
  const prevBtn = d3.select("#prev-statement-btn");
  const nextBtn = d3.select("#next-statement-btn");
  if (index === 0) {
    disableButton(prevBtn);
    enableButton(nextBtn, "next", chart);
  } else if (index === statements.length - 1) {
    disableButton(nextBtn);
    enableButton(prevBtn, "prev", chart);
  } else {
    enableButton(prevBtn, "prev", chart);
    enableButton(nextBtn, "next", chart);
  }
}

function disableButton(button) {
  button.on("click", null).classed("disabled-btn", true);
}

function enableButton(button, id, chart) {
  button.classed("disabled-btn", false);
  if (id === "prev") {
    button.on("click", () => {
      if (statementIndex > 0) {
        statementIndex--;
        d3.selectAll(".label").remove();
        singleNumeracyChart(statements[statementIndex], chart);
        updateButtons(statementIndex, statements, chart);
      }
    });
  } else if (id === "next") {
    button.on("click", () => {
      if (statementIndex < statements.length - 1) {
        statementIndex++;
        d3.selectAll(".label").remove();
        singleNumeracyChart(statements[statementIndex], chart);
        updateButtons(statementIndex, statements, chart);
      }
    });
  }
}

function singleNumeracyChart(statement, chart) {
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
      .style("font-size", "20px")
      .style("fill", colors[key]);
    // Show label when hovering
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

async function interactiveNumeracyChart(chart) {
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
    .append("svg:image")
    .attr("href", "data:image/svg+xml;base64," + rightArrow)
    .attr("width", buttonSize)
    .attr("id", "next-statement-btn")
    .attr("x", svgWidth - buttonSize - padding);

  statementSelector
    .append("svg:image")
    .attr("href", "data:image/svg+xml;base64," + leftArrow)
    .attr("width", buttonSize)
    .attr("id", "prev-statement-btn")
    .attr("x", padding);

  // implement chart
  singleNumeracyChart(statements[statementIndex], chart);

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

  updateButtons(statementIndex, statements, chart);
}

export default interactiveNumeracyChart;
