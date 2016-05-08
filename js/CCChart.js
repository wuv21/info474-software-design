// script.js

// Inspired by
// http://prcweb.co.uk/lab/energy/ - example of circular visualization
// http://bl.ocks.org/cmdoptesc/6226150 - concentric circle visualization

function CCChart() {
    var width = 960;
    var height = 800;
    var circle = 2 * Math.PI;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var colorScale = ["#deebf7", "#084594"];
    var arcConstraints = [width *.08, width / 3.5];
    var hoverColor = "#EB7F00";
    var arcStrokeWidth = 2;

    function my(selection) {
        selection.each(function(data) {

            var svg = d3.select(this).selectAll('svg').data(data);

            var gEnter = svg.enter().append('svg')
                .attr('width', width)
                .attr('height', height);

            gEnter.append('g')
                .attr('transform', 'translate(' + width/3 + ',' + height/2.5 + ')');
            var g = svg.selectAll('g');

            var textDisplay = gEnter.append('text')
                .attr('class', 'textDisplay')
                .attr('transform', 'translate(' + (width * (2/3)) + ',' + height/2.5 + ')')
                .attr('font-size', 20)
                .attr('fill', '#000')
                .text('Hover over individual sector');

            var textDisplayE = d3.selectAll('.textDisplay');

            var accessedData = data[0];

            var minYear = d3.min(accessedData, function(d) {return d.year});
            var maxYear = d3.max(accessedData, function(d) {return d.year});

            var minValue = d3.min(accessedData, function(d) {return d.value});
            var maxValue = d3.max(accessedData, function(d) {return d.value});

            var monthScale = d3.scale.ordinal().domain(months).rangeBands([0, circle]);
            var yearScale = d3.scale.linear().domain([minYear, maxYear]).range(arcConstraints);
            var valueScale = d3.scale.linear().domain([minValue, maxValue]).range(colorScale);

            var createArc = d3.svg.arc()
                .innerRadius(function(d) {return yearScale(d.year - 1)})
                .outerRadius(function(d) {return yearScale(d.year)})
                .startAngle(function(d) {return monthScale(d.month)})
                .endAngle(function(d) {return monthScale(d.month) + circle / 12});

            var arcs = g.selectAll('path').data(accessedData);

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
                    console.log('here');
                    textDisplayE.text(d.month + ' ' + d.year + ': ' + d.value);
                    d3.select(this)
                        .style('fill', hoverColor);
                })
                .on('mouseout', function(d) {
                    textDisplayE.text('Hover over individual sector');
                    d3.select(this)
                        .style('fill', function(d) {return valueScale(d.value)});
                });

            arcs.exit().remove();

            arcs.transition()
                .duration(2000)
                .style('fill', function(d) {return valueScale(d.value)})
                .attr('d', createArc);

            var monthLabels = gEnter.append("text")
                .attr('class', 'monthLabels')
                .attr('transform', 'translate(' + width/3 + ',' + height/2.5 + ')');

            var monthLabelsText = d3.selectAll(".monthLabels");
            months.forEach(function(month) {
                monthLabelsText.append("textPath")
                    .attr("text-anchor", "middle")
                    .attr("dy", 50)
                    .attr("startOffset", "20%")
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 0)
                    .attr("xlink:href", '#arc-' + maxYear + month)
                    .text(month);
            });

            svg.exit().remove();
        });
    }

    my.width = function(val) {
        if (!arguments.length) return width;

        width = val;
        return my;
    };

    my.height = function(val) {
        if (!arguments.length) return height;

        height = val;
        return my;
    };

    my.colorScale = function(val) {
        if (!arguments.length) return colorScale;

        colorScale = val;
        return my;
    };

    my.arcConstraints = function(val) {
        if (!arguments.length) return arcConstraints;

        arcConstraints = val;
        return my;
    };

    my.hoverColor = function(val) {
        if (!arguments.length) return hoverColor;

        hoverColor = val;
        return my;
    };

    my.arcStrokeWidth = function(val) {
        if (!arguments.length) return arcStrokeWidth;

        arcStrokeWidth = val;
        return my;
    };

    return my;
}