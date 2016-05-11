// CCChart.js

// Inspired and helped by
// http://prcweb.co.uk/lab/energy/ - example of circular visualization
// http://bl.ocks.org/cmdoptesc/6226150 - concentric circle visualization
// https://bost.ocks.org/mike/chart/time-series-chart.js - reusable chart tutorial especially with gEnter/selection
// http://stackoverflow.com/questions/20447106/how-to-center-horizontal-and-vertical-text-along-an-textpath-inside-an-arc-usi - aligning textpath with arcs

function CCChart() {
    // default properties of CCChart
    var width = 960;
    var height = 800;
    var circle = 2 * Math.PI;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var colorScale = ["#deebf7", "#084594"];
    var arcConstraints = [100, width / 3.5];
    var hoverColor = "#EB7F00";
    var arcStrokeWidth = 2;

    // CCChart constructor
    function my(selection) {
        selection.each(function(data) {
            var svg = d3.select(this).selectAll('svg').data(data);
            var gEnter = svg.enter().append('svg').append('g');

            svg.attr('width', width)
                .attr('height', height);

            var g = svg.selectAll('g');
            g.attr('transform', 'translate(' + width/3 + ',' + height/2.5 + ')');

            d3.select('#textDisplay').remove();
            svg.append('text')
                .attr('id', 'textDisplay')
                .attr('transform', 'translate(' + (width * (2/3)) + ',' + height/2.5 + ')')
                .attr('font-size', 20)
                .attr('fill', '#000')
                .text('Hover over individual sector');

            var accessedData = data[0];

            var minYear = d3.min(accessedData, function(d) {return d.year});
            var maxYear = d3.max(accessedData, function(d) {return d.year});

            var minValue = d3.min(accessedData, function(d) {return d.value});
            var maxValue = d3.max(accessedData, function(d) {return d.value});

            var monthScale = d3.scale.ordinal().domain(months).rangeBands([0, circle]);
            var yearScale = d3.scale.linear().domain([minYear - 1, maxYear]).range(arcConstraints);
            var valueScale = d3.scale.linear().domain([minValue, maxValue]).range(colorScale);

            // arc creation function
            var createArc = d3.svg.arc()
                .innerRadius(function(d) {return yearScale(d.year - 1)})
                .outerRadius(function(d) {return yearScale(d.year)})
                .startAngle(function(d) {return monthScale(d.month)})
                .endAngle(function(d) {return monthScale(d.month) + circle / months.length});

            // arc data-join
            var arcs = g.selectAll('.data-arcs').data(accessedData);

            // arc entrance and attribute/style declarations
            arcs.enter().append('path')
                .attr('class', 'data-arcs')
                .attr('id', function(d) {return "arc-" + d.year + d.month})
                .attr('data-toggle', 'tooltip')
                .style('fill', '#DDD')
                .attr('stroke', '#DDD')
                .attr('stroke-width', arcStrokeWidth)
                .attr('d', createArc)
                .attr('title', function(d) {return d.year + " " + d.month + ": " + d.value})
                .on('mouseover', function(d) {
                    // updates hover color and textDisplay
                    var textDisplay = d3.select('#textDisplay');

                    textDisplay.text(d.month + ' ' + d.year + ': ' + d.value);
                    d3.select(this)
                        .style('fill', hoverColor);
                })
                .on('mouseout', function() {
                    // resets hover color and textDisplay
                    var textDisplay = d3.select('#textDisplay');

                    textDisplay.text('Hover over individual sector');
                    d3.select(this)
                        .style('fill', function(d) {return valueScale(d.value)});
                });

            // arc exit and deletion of data no longer present.
            arcs.exit().remove();

            // arc transition effects
            arcs.transition()
                .duration(1000)
                .style('fill', function(d) {return valueScale(d.value)})
                .attr('d', createArc);

            // outside month labels
            gEnter.append("text")
                .attr('id', 'monthLabelsText');

            d3.selectAll(".month-arc").remove();

            var monthLabels = d3.select('#monthLabelsText');
            d3.selectAll(".monthLabel").remove();

            months.forEach(function(month) {
                // arc for outer transparent circles
                var createMonthArc = d3.svg.arc()
                    .innerRadius(yearScale(maxYear))
                    .outerRadius(yearScale(maxYear) + 5)
                    .startAngle(monthScale(month))
                    .endAngle(monthScale(month) + circle / 12);

                // draws outer transparent circles
                g.append('path')
                    .attr('id', 'month-arc' + month)
                    .attr('class', 'month-arc')
                    .attr('stroke-width', arcStrokeWidth)
                    .style('fill', 'rgba(0, 0, 0, 0)')
                    .attr('d', createMonthArc);

                // draws actual text
                monthLabels.append("textPath")
                    .attr('class', 'monthLabel')
                    .attr("text-anchor", "middle")
                    .attr("startOffset", "25%")
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 0)
                    .attr("xlink:href", '#month-arc' + month)
                    .text(month);
            });

            // remove svg elements not bound to data anymore
            svg.exit().remove();
        });
    }

    // accessor function for width property
    my.width = function(val) {
        if (!arguments.length) return width;

        width = val;
        return my;
    };

    // accessor function for height property
    my.height = function(val) {
        if (!arguments.length) return height;

        height = val;
        return my;
    };

    // accessor function for color scale property
    my.colorScale = function(val) {
        if (!arguments.length) return colorScale;

        colorScale = val;
        return my;
    };

    // accessor function for arc constraints property
    my.arcConstraints = function(val) {
        if (!arguments.length) return arcConstraints;

        arcConstraints = val;
        return my;
    };

    // accessor function for hover color property
    my.hoverColor = function(val) {
        if (!arguments.length) return hoverColor;

        hoverColor = val;
        return my;
    };

    // accessor function for arc stroke width property
    my.arcStrokeWidth = function(val) {
        if (!arguments.length) return arcStrokeWidth;

        arcStrokeWidth = val;
        return my;
    };

    // accessor function for array of months property
    my.months = function(val) {
        if (!arguments.length) return months;

        months = val;
        return my;
    };

    return my;
}