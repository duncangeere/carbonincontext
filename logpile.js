// =============================
// This is the logpile chart script
// =============================

// Get chart size
const margin = {
	top: 50,
	right: 20,
	bottom:0,
	left: 100};

const svg = d3.select("#chart"),
	  height = +svg.attr("height"),
	  innerHeight = height - margin.top - margin.bottom,
	  gutter = 80, // gutter between charts
	  circleSize = 35,
	  labelOpacity = "8%";

// Define my different scales
const circleScale = d3.scaleSqrt().domain([0,1000000000000]).range ([20, 50]);

const scales = [
	{"name": "Kg",
	"low": 0,
	"high": 1},
	{"name": "Tonnes",
	"low": 0,
	"high": 1000},
	{"name": "Ktonnes",
	"low": 0,
	"high": 1000000},
	{"name": "Mtonnes",
	"low": 0,
	"high": 1000000000},
	{"name": "Gtonnes",
	"low": 0,
	"high": 1000000000000}]

// Set the domains for the scales
for (let i=0; i < scales.length; i++) {
	const scale = d3.scaleLinear().domain([scales[i].low, scales[i].high]);
	scales[i].scale = scale;
}

// Main chart-drawing function
function drawchart(error, data) {

	// Save some repetition later.
	for (i = 0; i < scales.length; i++) {
		const chartHeight = innerHeight/scales.length;

		const toPlot = scales[i].data;
		const scale = scales[i].scale
			.range([0, chartHeight - gutter]);

		// Add a group that'll contain the axis
		const chart = svg.append("g")
			.attr("transform", `translate(${margin.left},${margin.top + (i*chartHeight)})`)
			.attr("id", `${scales[i].name}`)
			.attr("class", "chart");

		// Plot the axis
		const axis = chart.append("g")
			.call(d3.axisLeft(scale))
			.attr("class", "axis")
			.attr("id", `${scales[i].name}`);

		console.log(scales[i].name);

		// Label each chart with scale name
		chart.append("text")
			.text(scales[i].name)
			.style("text-anchor","center")
			.style("font-size", "450%")
			.style("font-weight", "bold")
			.attr("transform", "rotate(90)")
			.attr("opacity", labelOpacity);

		// Plot the data
		const circles = chart.selectAll("circle")
			.data(toPlot)
			.enter()
			.append("circle")
			.attr("cx", 0)
			.attr("cy", d => scale(d.co2e))
			.attr("r", circleSize);

		// Plot some label lines
		const lines = chart.append("g").attr("class", "labelline")
			.selectAll(".labelline")
			.data(toPlot)
			.enter()
			.append("line")
			.attr("x1", circleSize)
			.attr("y1", d => scale(d.co2e))
			.attr("x2", circleSize + 12)
			.attr("y2", d => scale(d.co2e));

		// Plot the labels
		const labels = chart.selectAll(".label")
			.data(toPlot)
			.enter()
			.append("text");

		labels.attr("x", circleSize + 15)
			.attr("y", d => scale(d.co2e) + 4)
			.text(d => d.thing)
			.style("font-size", "70%");
	}

};

// Load the data, then run the chart-drawing function
d3.csv("data.csv").then(data => {
	// Turn the numbers from strings into numbers
	data.forEach(d => {d.co2e = +d.co2e});

	// Filter the data for each scale and store it in the scales object
	for (let i=0; i < scales.length; i++) {
		const filteredData = data.filter(datapoint => (datapoint["scale"] == scales[i].name) && (datapoint["display"] == "TRUE"));
		scales[i].data = filteredData;
	}

	svg.append("text")
		.text("CO2 in Tonnes")
		.style("font-size", "70%")
		.style("text-anchor", "end")
		.style("font-weight", "bold")
		.attr("x", margin.left)
		.attr("y", margin.top - 12);

	// Run the drawchart function
	drawchart(data);
});

