// =============================
// This is the logpile chart script
// =============================

// Get chart size
const margin = {
	top: 20,
	right: 20,
	bottom:0,
	left: 100};

const svg = d3.select("#chart")
const width = +svg.attr("width");
const height = +svg.attr("height");
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom
const gutter = 50; // gutter between charts

// Define my different scales
const circleScale = d3.scaleSqrt().domain([0,1000000000000]).range ([1, 100]);


const scales = [
	{"name": "Kg",
	"low": 0,
	"high": 1
	{"name": "Tonnes",
	"low": 0,
	"high": 1000
	{"name": "Ktonnes",
	"low": 0,
	"high": 1000000
	{"name": "Mtonnes",
	"low": 0,
	"high": 1000000000
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

	// if (error) throw error;

	// Save some repetition later.
	for (i = 0; i < scales.length; i++) {
		const chartHeight = innerHeight/scales.length;

		const toPlot = scales[i].data;
		const scale = scales[i].scale
						.range([0, chartHeight - gutter]);

		// Add a group that'll contain the axis
		svg.append("g")
			.attr("transform", `translate(${margin.left},${margin.top + (i*chartHeight)})`)
			.attr("id", `${scales[i].name}-chart`);

		const chart = d3.select(`#${scales[i].name}-chart`);

		// Plot the axis
		const axis = chart.append("g")
			.call(d3.axisLeft(scale))
			.attr("class", "axis")
			.attr("id", `${scales[i].name}`);

		// Label each chart with scale name
		chart.append("text")
			.text(scales[i].name)
			.style("text-anchor","end")
			.style("font-size", "70%")
			.style("font-weight", "bold")
			.attr("transform",`translate(-28,3)`);

		// Debug logging - DELETE ME
		console.log(scales[i].name);
		console.log(toPlot);

		// Plot the data
		const circles = chart.selectAll("circle")
			.data(toPlot)
			.enter()
			.append("circle")
			.attr("cx", 0)
			.attr("cy", d => scale(d.co2e))
			.attr("r", 20);

		// Plot the labels
		const text = chart.selectAll("text")
			.data(toPlot)
			.enter()
			.append("text");

		text.attr("x", 50)
			.attr("y", d => scale(d.co2e))
			.text(d => d.thing)
			.style("font-size", "70%");

		console.log(text);
	}

};

// Load the data, then run the chart-drawing function
d3.csv("data.csv").then(data => {
	// Turn the numbers from strings into numbers
	data.forEach(d => {d.co2e = +d.co2e});

	// Filter the data for each scale and store it in the scales object
	for (let i=0; i < scales.length; i++) {
		const filteredData = data.filter(datapoint => datapoint["scale"] == scales[i].name)
		scales[i].data = filteredData;
	}

	// Run the drawchart function
	drawchart(data);
});

