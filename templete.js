// Scatter Plot with Groups
d3.csv("iris.csv").then(data => {
    // Convert strings to numbers
    data.forEach(d => {
        d.petalLength = +d.petalLength;
        d.petalWidth = +d.petalWidth;
    });

    // SVG dimensions and margins
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Append SVG canvas
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.petalLength) - 1, d3.max(data, d => d.petalLength) + 1])
        .range([0, width]);
    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.petalWidth) - 0.5, d3.max(data, d => d.petalWidth) + 0.5])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica"])
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add axis labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Petal Length");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Petal Width");

    // Add scatter plot points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.petalLength))
        .attr("cy", d => yScale(d.petalWidth))
        .attr("r", 5)
        .style("fill", d => colorScale(d.species));

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(${width - 100},${i * 20})`);

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorScale);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d);
});

// Side-by-Side Boxplot
d3.csv("iris.csv").then(data => {
    // Convert strings to numbers
    data.forEach(d => {
        d.petalLength = +d.petalLength;
    });

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(["setosa", "versicolor", "virginica"])
        .range([0, width])
        .padding(0.5);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.petalLength)])
        .range([height, 0]);

    // Calculate quartiles, median, IQR
    const rollupFunction = (values) => {
        values.sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25);
        const median = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const iqr = q3 - q1;
        return { q1, median, q3, iqr };
    };

    const quartilesBySpecies = d3.rollup(data, 
        v => rollupFunction(v.map(d => d.petalLength)), 
        d => d.species);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    quartilesBySpecies.forEach((quartiles, species) => {
        const x = xScale(species);
        const boxWidth = xScale.bandwidth();

        // Draw IQR range line
        svg.append("line")
            .attr("x1", x + boxWidth / 2)
            .attr("x2", x + boxWidth / 2)
            .attr("y1", yScale(quartiles.q1 - 1.5 * quartiles.iqr))
            .attr("y2", yScale(quartiles.q3 + 1.5 * quartiles.iqr))
            .style("stroke", "black");

        // Draw box from q1 to q3
        svg.append("rect")
            .attr("x", x)
            .attr("y", yScale(quartiles.q3))
            .attr("width", boxWidth)
            .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
            .style("fill", "lightgray");

        // Draw median line
        svg.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(quartiles.median))
            .attr("y2", yScale(quartiles.median))
            .style("stroke", "black");
    });
});

