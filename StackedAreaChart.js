
export function StackedAreaChart(container) {
    //initialization
    const margin = ({top: 40, right: 40, bottom: 40, left: 40});

    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // create scales without domains
    const xScale = d3.scaleTime()
        .range([50, width]);

    const yScale = d3.scaleLinear()
        .range([0, height]);

    const colorScale = d3.scaleOrdinal()
        .range(d3.schemeTableau10);

    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);
    
    svg.append('g')
        .attr('class', 'axis x-axis');

    svg.append('g')
        .attr('class', 'axis y-axis');


    const tooltip = svg.append('text');

    tooltip.attr('class', 'industryLabel')
            .attr('x', 60)
            .attr('y', 0);

    let selected = null, xDomain, data;

    function update(_data) {
        data = _data;
        const keys = selected? [selected] : data.columns.slice(1);

        var stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
        var stackedData = stack(data);

        colorScale.domain(keys);
        xScale.domain(xDomain? xDomain: d3.extent(data, d => new Date(d.date)));
        yScale.domain([d3.max(stackedData, d => d3.max(d, d => d[1])), 0]); // within each array of series, find the max of the second (y1)
        
        const area = d3.area()
            .x(function(d) {return xScale(d.data.date);})
            .y0(function(d) {return yScale(d[0]);})
            .y1(function(d) {return yScale(d[1]);});

        const areas = svg.selectAll('.area')
            .data(stackedData, function(d) {return d.key});

        areas.enter()
            .append('path')
                .attr('fill', function(d) {return colorScale(d.key);})
            .merge(areas)
            .attr('d', area)
            .attr('clip-path', 'url(#clip)')
            .attr('class', 'area')
            .on('mouseover', function(event, d, i) {
                tooltip.text(d.key);
            })
            .on('mouseout', function(event, d, i) {
                tooltip.text('');
            })
            .on('click', (event, d) => {
                // toggle selected based on d.key
                if (selected === d.key) {
                    selected = null;
                } else {
                    selected = d.key;
                }
                update(data);
            });

        areas.exit().remove();

        svg.select('.x-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
        
        svg.select('.y-axis')
        .attr('transform', 'translate(' + 50 + ',0)')
        .call(yAxis);

        svg.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width - margin.left - 10)
        .attr('height', height)
        .attr('transform', 'translate(' + 50 + ',0)');
    }

    function filterByDate(range) {
        xDomain = range;
        update(data);
    }

    return {
        update,
        filterByDate
    };
};