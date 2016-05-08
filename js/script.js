document.addEventListener('DOMContentLoaded', function() {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

    console.log(sampleData);
    var myChart = CCChart();
    var chartWrapper = d3.select('#vis').datum([sampleData]).call(myChart);



    document.getElementById('test-btn').addEventListener('click', function() {
        console.log('me');

        sampleData = [];

        for (var i = 2000; i < Math.floor(Math.random() * (2010 - 2002) + 2002); i++) {
            months.forEach(function (month) {
                sampleData.push({
                    month: month,
                    year: i,
                    value: Math.round(Math.random() * 50)
                });
            });
        }
        chartWrapper.datum([sampleData]).call(myChart);

        //myChart.hoverColor('green');
        //chartWrapper.call(myChart)
    });


});