document.addEventListener('DOMContentLoaded', function() {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var sampleData = [];
    for (var i = 2000; i < 2006; i++) {
        months.forEach(function(month) {
            sampleData.push({
                month: month,
                year: i,
                value: Math.round(Math.random() * 50)
            });
        });
    }

    console.log(sampleData);
    var myChart = CCChart();
    var chartWrapper = d3.select('#vis').datum([sampleData]).call(myChart);



    document.getElementById('test-btn').addEventListener('click', function() {
        console.log('clicked');

        sampleData = [];
        var minYear = Math.floor(Math.random() * (2010 - 2007) + 2007);
        var maxYear = Math.floor(Math.random() * (10) + minYear);

        for (var i = minYear; i < maxYear; i++) {
            months.forEach(function (month) {
                sampleData.push({
                    month: month,
                    year: i,
                    value: Math.round(Math.random() * 50)
                });
            });
        }
        chartWrapper.datum([sampleData]).call(myChart);
    });

    document.getElementById('test-btn-2').addEventListener('click', function() {
        myChart.width(800);
        chartWrapper.call(myChart)
    });


});