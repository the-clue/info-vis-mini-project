// Directories
const data_path = "data/data_01.json" // Change this to use other data_cases
const svg_path = "images/mosquito.svg"

// Function to load the SVG
function loadSVG(url, callback) {
    d3.xml(url).then(data => {
        document.getElementById('hidden-svg').appendChild(data.documentElement);
        callback();
    });
}

// Function to initialize the visualization
function initVisualization() {
    d3.json(data_path).then(data => {
        const svg = d3.select("#mosquito-svg");
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const margin = 50; // Margin used to avoid mosquitoes going out of the borders

        // Scale functions to map data values to coordinates
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.x1, d.x2, d.x3))])
            .range([margin, width - margin]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.y1, d.y2, d.y3))])
            .range([margin, height - margin]);
        /*
        // Alternative that puts the margins on the domain
        const xScale = d3.scaleLinear()
            .domain([0 - margin, d3.max(data, d => Math.max(d.x1, d.x2, d.x3)) + margin])
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain([0 - margin, d3.max(data, d => Math.max(d.y1, d.y2, d.y3)) + margin])
            .range([0, height]);
        */

        let configIndex = 0; // Indicates which variables to use
        const scaleFactor = 0.05; // Factor to scale the size of the mosquitoes

        let currentX = "x1";
        let currentY = "y1";

        // Draw mosquito silhouettes
        const mosquitoes = svg.selectAll(".mosquito")
            .data(data)
            .enter().append("g")
            .attr("class", "mosquito")
            .attr("transform", d => {return `translate(${xScale(d.x1)}, ${yScale(d.y1)}) scale(${scaleFactor})`;
            })
            .on("click", function(event, d) {
                d3.select(this).classed("squashed", true).classed("mosquito", false);
                event.stopPropagation();
            })
            // Shows tooltip indicating the id (for debugging) and the coordinates of the mosquito
            .on("mouseover", function(event, d) {
                if (!d3.select(this).classed("squashed")) { // So that tooltips are not shown for squashed mosquitoes
                    const tooltip = d3.select("#tooltip");
                    tooltip.style("display", "block");
                    tooltip.html(`id: ${d.id}, x: ${d[currentX]}, y: ${d[currentY]}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px");
                }
            })
            .on("mouseout", function() {
                d3.select("#tooltip").style("display", "none");
            });

        mosquitoes.each(function() {
            const mosquitoSVG = d3.select("#hidden-svg svg").node().cloneNode(true);
            d3.select(this).node().appendChild(mosquitoSVG);
        });

        // Function to update the positions of the mosquitoes
        function updatePositions() {
            configIndex = (configIndex + 1) % 3;

            if (configIndex === 0) {
                currentX = "x1";
                currentY = "y1";
            } else if (configIndex === 1) {
                currentX = "x2";
                currentY = "y2";
            } else {
                currentX = "x3";
                currentY = "y3";
            }

            mosquitoes.filter(".mosquito").transition()
                .duration(1000)
                // Use this instead of all the code below if you don't like the flipping effect when changing positions
                //.attr("transform", d => `translate(${xScale(d[currentX])}, ${yScale(d[currentY])}) scale(${scaleFactor})`);
                .attr("transform", d => { // this moves the mosquitoes and flips them with respect to the direction of movement
                    const newX = xScale(d[currentX]);
                    const newY = yScale(d[currentY]);
                    const dx = xScale(d[currentX]) - xScale(d.previousX || d.x1); // Calculate the change in x
                    d.previousX = d[currentX]; // Save the current position for the next calculation

                    // Calculate the scale factor along the x-axis based on the direction of movement
                    const scaleX = dx > 0 ? -scaleFactor : scaleFactor;

                    // Used to compensate the flip as it doesn't flip from the center but from the left edge of the SVG
                    xCompensation = dx > 0 ? (-width) : 0;

                    return `translate(${newX}, ${newY}) scale(${scaleX}, ${scaleFactor}) translate(${xCompensation}, 0)`;
                });
        }

        // Click event to update mosquito positions
        svg.on("click", function() {
            updatePositions();
        });
    });
}

// Load the SVG and initialize the visualization
loadSVG(svg_path, initVisualization);