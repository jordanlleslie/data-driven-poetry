import numeracyChart from "./utils/numeracyChart.js";
import pieChart from "./utils/pieChart.js";

let chart, chartWidth, chartHeight;
const svgWidth = 700;
const svgHeight = 500;
let svg = d3.select("#svg");

let discrimination_experiences, correction_reasons;

let keyframeIndex = 0;
let keyframes = [
  {
    activeVerse: 1,
    activeLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    activeVerse: 2,
    activeLines: [1, 2, 3, 4],
  },
  {
    activeVerse: 2,
    activeLines: [5, 6, 7, 8, 9, 10, 11],
    svgUpdate: numeracyChartWrapper,
  },
  {
    activeVerse: 3,
    activeLines: [1, 2, 3, 4, 5, 6],
    svgUpdate: pieChartWrapper,
  },
  {
    activeVerse: 4,
    activeLines: [1, 2, 3, 4, 5, 6, 7, 8],
  },
];

d3.select("#backward-button").classed("disabled-btn", keyframeIndex === 0);
d3.select("#forward-button").classed(
  "disabled-btn",
  keyframeIndex === keyframes.length - 1
);

document
  .getElementById("forward-button")
  .addEventListener("click", forwardClicked);
document
  .getElementById("backward-button")
  .addEventListener("click", backwardClicked);

function forwardClicked() {
  // Make sure we don't let the keyframeIndex go out of range
  if (keyframeIndex < keyframes.length - 1) {
    keyframeIndex++;
    drawKeyframe(keyframeIndex);
  }
}

function backwardClicked() {
  if (keyframeIndex > 0) {
    keyframeIndex--;
    drawKeyframe(keyframeIndex);
  }
}

function drawKeyframe(kfi) {
  let kf = keyframes[kfi];
  // update enabled/disabled buttons
  d3.select("#backward-button").classed("disabled-btn", keyframeIndex === 0);
  d3.select("#forward-button").classed(
    "disabled-btn",
    keyframeIndex === keyframes.length - 1
  );

  resetActiveLines();
  updateActiveVerse(kf.activeVerse);

  for (let line of kf.activeLines) {
    updateActiveLine(kf.activeVerse, line);
  }

  if (kf.svgUpdate) {
    kf.svgUpdate();
  }
}

function resetActiveLines() {
  d3.selectAll(".line").classed("active-line", false);
}

function updateActiveVerse(id) {
  d3.selectAll(".verse").classed("active-verse", false);
  d3.select("#verse" + id).classed("active-verse", true);
  scrollLeftColumnToActiveVerse(id);
}

function updateActiveLine(vid, lid) {
  let thisVerse = d3.select("#verse" + vid);
  thisVerse.select("#line" + lid).classed("active-line", true);
}

function scrollLeftColumnToActiveVerse(id) {
  // select the div displaying the left column content
  var poemContainer = document.querySelector("#poem");

  // select the verse we want to display
  var activeVerse = document.getElementById("verse" + id);

  // calculate the bounding rectangles of both of these elements
  var verseRect = activeVerse.getBoundingClientRect();
  var poemRect = poemContainer.getBoundingClientRect();

  // calculate the desired scroll position
  var desiredScrollTop =
    verseRect.top +
    poemContainer.scrollTop -
    poemRect.top -
    (poemRect.height - verseRect.height) / 2;

  poemContainer.scrollTo({
    top: desiredScrollTop,
    behavior: "smooth",
  });
}

async function loadData() {
  discrimination_experiences = await d3.csv(
    "./assets/data/discrimination_experiences.csv"
  );
  correction_reasons = await d3.csv("./assets/data/correction_reasons.csv");
}

let rightArrow, leftArrow;

async function loadImages() {
  let data = await d3.text("./assets/images/Right.svg");
  rightArrow = btoa(data);
  data = await d3.text("./assets/images/Left.svg");
  leftArrow = btoa(data);
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
    .style("font-size", "20px")
    .text("");
}

function updateTitle(title) {
  if (title.length > 0 && title !== svg.select("#chart-title").text()) {
    // TODO: Add transition
    svg.select("#chart-title").text(title);
  }
}

function numeracyChartWrapper() {
  initializeSVG();
  updateTitle(
    "Self-reported experiences of linguistic discrimination in Germany"
  );
  numeracyChart(chart);
}

function pieChartWrapper() {
  initializeSVG();
  updateTitle(
    "Teachers' reasons for correcting and not correcting students' speech"
  );
  pieChart(correction_reasons, chartWidth, chartHeight, chart);
}

async function initialize() {
  await loadData();
  await loadImages();
  drawKeyframe(0);
}

initialize();

export {
  discrimination_experiences,
  svg,
  svgWidth,
  svgHeight,
  chartWidth,
  chartHeight,
  rightArrow,
  leftArrow,
};
