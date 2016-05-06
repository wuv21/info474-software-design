// script.js

// Inspired by
// http://prcweb.co.uk/lab/energy/ - example of circular visualization
// http://bl.ocks.org/cmdoptesc/6226150 - concentric circle visualization

document.addEventListener('DOMContentLoaded', function() {
    // var projectChart = function() {
    //
    //     var chart = function(selection) {
    //         selection.each(function(data) {
    //             var div  = d3.select(this);
    //
    //         });
    //     }
    // }

    var width = 960;
    var height = 800;
    var circle = 2 * Math.PI;

    var svg = d3.select('#vis')
        .append('svg')
        .attr("width", width)
        .attr("height", height);

    var g = svg.append('g')
        .attr('transform', 'translate(' + width/3 + ',' + height/2.5 + ')');

    var textDisplay = svg.append('text')
        .attr('transform', 'translate(' + (width/3 + 325) + ',' + height/2.5 + ')')
        .attr('width', 400)
        .attr('font-size', 20)
        .attr('fill', '#000')
        .text('Hover over individual sector');

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var angleYear = [];
    for (var i = 1; i <= 12; i++) {
        angleYear.push({
            startAngle: circle / 12 * (i-1),
            endAngle: circle / 12 * i
        });
    }

    var sampleData = [];
    for (var i = 2000; i < 2005; i++) {
        months.forEach(function(month) {
            sampleData.push({
                month: month,
                year: i,
                value: Math.round(Math.random() * 50)
            });
        });
    }

    var minYear = d3.min(sampleData, function(d) {return d.year});
    var maxYear = d3.max(sampleData, function(d) {return d.year});

    var minValue = d3.min(sampleData, function(d) {return d.value});
    var maxValue = d3.max(sampleData, function(d) {return d.value});

    var monthScale = d3.scale.ordinal().domain(months).rangeBands([0, circle]);
    var yearScale = d3.scale.linear().domain([minYear, maxYear]).range([80, 300]);
    var valueScale = d3.scale.linear().domain([minValue, maxValue]).range(["#deebf7", "#084594"]);

    var createArc = d3.svg.arc()
        .innerRadius(function(d) {return yearScale(d.year - 1)})
        .outerRadius(function(d) {return yearScale(d.year)})
        .startAngle(function(d) {return monthScale(d.month)})
        .endAngle(function(d) {return monthScale(d.month) + circle / 12});

    var arcs = g.selectAll('path').data(sampleData);

    arcs.enter()
        .append('path')
        .attr('class', 'data-arcs')
        .attr('id', function(d) {return "arc-" + d.year + d.month})
        .style('fill', function(d) {return valueScale(d.value)})
        .attr('data-toggle', 'tooltip')
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .attr('d', createArc)
        .attr('title', function(d) {return d.year + " " + d.month})
        .on('mouseover', function(d) {
            textDisplay.text(d.month + ' ' + d.year + ': ' + d.value);
            d3.select(this)
                .style('fill', '#EB7F00');
        })
        .on('mouseout', function(d) {
            textDisplay.text('Hover over individual sector');
            d3.select(this)
                .style('fill', function(d) {return valueScale(d.value)});

        });

    var monthLabels = g.append("text");

    months.forEach(function(month) {
        monthLabels.append("textPath")
            .attr("text-anchor", "middle")
            .attr("dy", 50)
            .attr("startOffset", "20%")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 0)
            .attr("xlink:href", '#arc-' + maxYear + month)
            .text(month);
    })



});