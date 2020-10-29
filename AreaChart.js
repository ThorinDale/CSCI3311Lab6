
export function AreaChart(container) {

    // intialization
    const margin = ({top: 40, right: 40, bottom: 40, left: 40});

    const width = 1000 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const xScale = d3.scaleTime()
        .range([50, width]);

    const yScale = d3.scaleLinear()
        .range([0, height]);

    svg.append('path')
        .attr('class', 'area');
        
    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append('g')
        .attr('class', 'axis x-axis');

    svg.append('g')
        .attr('class', 'axis y-axis');

    function update(data) {
        // console.log(data);

        // update scales, encoding, axes (use the total count)
        xScale.domain(d3.extent(data, d => new Date(d.date)));
        yScale.domain([d3.max(data, d => d.total), 0]);

        var area = d3.area()
                    .x(function(d) {return xScale(d.date);})
                    .y0(function() {return yScale(0);})
                    .y1(function(d) {return yScale(d.total);});

        svg.select('.area')
            .datum(data)
            // .attr('fill', 'steelblue')
            .attr('d', area);

        svg.select('.x-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.select('.y-axis')
            .attr('transform', 'translate(' + 50 + ',0)')
            .call(yAxis);
    }
    const listeners = { brushed: null };

    function on(event, listener) {
        listeners[event] = listener;
    }

    const brush = d3.brushX()
        .extent([[margin.left + 10, 0], [width, height]])
        .on('brush', brushed)
        .on('end', brushed);

    svg.append('g')
        .attr('class', 'brush')
        .call(brush);

    function brushed(event) {
        if (event.selection) {
            console.log(listeners['brushed']);
            listeners['brushed'](event.selection.map(xScale.invert));
            // console.log('brushed', event.selection);
            // console.log(event.selection.map(xScale.invert));
        }
    }

    return {
        update,
        on
    };
};