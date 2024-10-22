// Define the dimensions and margins of the SVG canvas
const margin = { top: 30, right: 30, bottom: 50, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append SVG to the body
const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Read the Iris data
d3.csv("iris.csv").then(data => {
    // Convert data to numeric types
    data.forEach(d => {
        d.PetalLengthCm = +d.PetalLengthCm;
        d.PetalWidthCm = +d.PetalWidthCm;
    });

    // Define scales for x, y, and colors
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.PetalLengthCm))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.PetalWidthCm))
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain([...new Set(data.map(d => d.Species))])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // Add circles for each data point
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.PetalLengthCm))
        .attr("cy", d => yScale(d.PetalWidthCm))
        .attr("r", 5)
        .style("fill", d => colorScale(d.Species))
        .style("opacity", 0.7);

    // Add X and Y axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(6))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .text("Petal Length (cm)");

    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(6))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("fill", "black")
        .text("Petal Width (cm)");

    // Add a legend
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend.append("circle")
        .attr("cx", width - 20)
        .attr("r", 5)
        .style("fill", colorScale);

    legend.append("text")
        .attr("x", width - 10)
        .attr("y", 5)
        .style("text-anchor", "start")
        .text(d => d);
});

