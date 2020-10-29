import {AreaChart} from './AreaChart.js';
import {StackedAreaChart} from './StackedAreaChart.js';

d3.csv('unemployment.csv', d3.autoType).then(data => {
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var rowLength = Object.keys(row).length;
        var unemployment = 0;
        for (var j = 1; j < rowLength; j++) {
            var cat = Object.getOwnPropertyNames(row)[j];
            unemployment += row[cat];
        }
        row.total = unemployment;
    }
    const areaChart1 = StackedAreaChart('.chart-container1');
    areaChart1.update(data);
    const areaChart2 = AreaChart('.chart-container2');
    areaChart2.update(data);

    areaChart2.on('brushed', (range) => {
        areaChart1.filterByDate(range);
    })
});