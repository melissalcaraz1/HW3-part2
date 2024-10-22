// Define dimensions for box plot
const marginBox = { top: 30, right: 30, bottom: 50, left: 60 },
    widthBox = 600 - marginBox.left - marginBox.right,
    heightBox = 400 - marginBox.top - marginBox.bottom;

// Create SVG for the box plot
const svgBox = d3.select("body")
    .append("svg")
    .attr("width", widthBox + marginBox.left + marginBox.right)
    .attr("height", heightBox + marginBox.top + marginBox.bottom)
    .append("g")
    .attr("transform", `translate(${marginBox.left},${marginBox.top})`);

// Prepare data
d3.csv("iris.csv").then(data => {
    data.forEach(d => {
        d.PetalLengthCm = +d.PetalLengthCm;
    });

    // Define scales
    const xScale = d3.scaleBand()
        .domain(["Setosa", "Versicolor", "Virginica"])
        .range([0, widthBox])
        .padding(0.5);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.PetalLengthCm)])
        .range([heightBox, 0]);

    // Calculate quartiles
    const rollupFunction = values => {
        const sorted = values.map(d => d.PetalLengthCm).sort(d3.ascending);
        const q1 = d3.quantile(sorted, 0.25);
        const median = d3.quantile(sorted, 0.5);
        const q3 = d3.quantile(sorted, 0.75);
        return { q1, median, q3 };
    };
    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.Species);

    // Draw boxes
    quartilesBySpecies.forEach((quartiles, species) => {
        const x = xScale(species);
        const boxWidth = xScale.bandwidth();
        svgBox.append("rect")
            .attr("x", x - boxWidth / 2)
            .attr("y", yScale(quartiles.q3))
            .attr("width", boxWidth)
            .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
            .style("fill", "#69b3a2");
    });

    svgBox.append("g").call(d3.axisLeft(yScale));
    svgBox.append("g")
        .attr("transform", `translate(0,${heightBox})`)
        .call(d3.axisBottom(xScale));
});

