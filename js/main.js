(function() {
    'use strict'

    var global = {
        trunk: {
            width: 360,
            height: 200,
            left: 0,
            right: 60,
            xax_count: 4
        }
    };

    var mouseover = function() {
        return function(d, i) {
            global.activeRevision = d.revision;
            d3.select('.revision-data')
                .html('Revision <a target="_blank" href="https://hg.mozilla.org/mozilla-central/rev/' + d.revision + '">' + d.revision + '</a> analyzed on ' + d.date);
        };
    }
    
    d3.text('data/modules.txt', function(data) {
        data.split('\n').forEach(function(module) {
            d3.select('.switch')
                .append('li')
                    .append('a')
                        .attr('href', '#')
                        .attr('id', 'goto-' + module)
                        .attr('class', 'pill')
                        .html(module);
        });

        //set the active pill and section on first load
        var module = (document.location.hash) ? document.location.hash.slice(1) : 'all';
        d3.select('#goto-' + module).classed('active', true);
        drawCharts(module);

        //event listeners
        $('ul.switch li a.pill').on('click', function(event) {
            event.preventDefault();
            $('ul.switch li a.pill').removeClass('active');
            $(this).addClass('active');

            var module = $(this).attr('id').slice(5);
            document.location.hash = module;

            drawCharts(module);

            return false;
        });
    });

    function drawCharts(module) {
        if(module == undefined) { module = 'all'; }

        d3.csv('data/full_metrics-' + module + '.csv', function(data) {
            data = MG.convert.date(data, 'date', '%Y-%m-%dT%H:%M:%SZ');
            data.map(function(d) {
                 d.mccabe = d.SumCyclomatic / d.CountLineCode * 1000;
                 d.core = d.core_size / d.files;
                 d.dependencies_per_10k = d.first_order_density * d.files;
            });

            var loc_min = d3.min(data, function(d) { return d.CountLineCode; });
            loc_min -=  loc_min * 0.01;
            var loc_max = d3.max(data, function(d) { return d.CountLineCode; });

            MG.data_graphic({
                title: "Lines of code",
                description: "LOC measures the number executable lines of code in each revision, ignoring comments and blank lines. LOC and defect density have an inverse relationship due to architecture not changing at the same rate as LOC and architectural elements such as interfaces having a higher propensity for defects than individual components. <b>Lower is better.</b>",
                data: data,
                width: global.trunk.width,
                height: global.trunk.height,
                xax_count: global.trunk.xax_count,
                right: global.trunk.right,
                target: '#loc',
                full_width: true,
                x_accessor: 'date',
                y_accessor: 'CountLineCode',
                linked: true,
                mouseover: mouseover()
            });

            var mccabe_min = d3.min(data, function(d) { return d.mccabe; });
            mccabe_min -=  mccabe_min * 0.008;
            var mccabe_max = d3.max(data, function(d) { return d.mccabe; });
            mccabe_max +=  mccabe_max * 0.008;

            MG.data_graphic({
                title: "Cyclomatic complexity",
                description: "Cyclomatic complexity measures the number of linearly independent paths within a software system and can be applied either to the entire system or to a particular class or function. In our measure of cyclomatic complexity, we control for size and hence, the value for each revision is per 1,000 LOC. <br /><a href='https://en.wikipedia.org/wiki/Cyclomatic_complexity'>Read more</a>. <b>Lower is better.</b>",
                data: data,
                width: global.trunk.width,
                height: global.trunk.height,
                xax_count: global.trunk.xax_count,
                right: global.trunk.right,
                target: '#mccabe',
                full_width: true,
                x_accessor: 'date',
                y_accessor: 'mccabe',
                linked: true,
                mouseover: mouseover()
            });

            MG.data_graphic({
                title: "Dependencies",
                description: "First-order density measures the number of direct dependencies between files. Here, we show dependencies as the number of files that a randomly chosen file can directly impact. Per the static analysis tool's <a href='http://scitools.com/documents/manuals/pdf/understand.pdf'>manual</a>, 'an item depends on another if it includes, calls, sets, uses, casts, or refers to that item.' <b>Lower is better.</b>",
                data: data,
                width: global.trunk.width,
                height: global.trunk.height,
                xax_count: global.trunk.xax_count,
                right: global.trunk.right,
                target: '#dependencies',
                full_width: true,
                x_accessor: 'date',
                y_accessor: 'dependencies_per_10k',
                linked: true,
                mouseover: mouseover()
            });

            MG.data_graphic({
                title: "Propagation",
                description: "Propagation measures direct as well as indirect dependencies between files in a codebase. In practical terms, it gives a sense of the actual reach of a change to a randomly chosen file. We calculate the propagation for each file through a process of matrix multiplication&mdash;see <a href='http://almossawi.com/firefox/prose'>this</a> and <a href='http://www.hbs.edu/faculty/Publication%20Files/05-016.pdf'>this</a>. <br /><b>Lower is better.</b>",
                data: data,
                width: global.trunk.width,
                height: global.trunk.height,
                xax_count: global.trunk.xax_count,
                right: global.trunk.right,
                format: 'perc',
                target: '#prop-cost',
                full_width: true,
                x_accessor: 'date',
                y_accessor: 'prop_cost',
                linked: true,
                mouseover: mouseover()
            });

            MG.data_graphic({
                title: "Highly interconnected files",
                description: "Highly interconnected files are files that are interconnected via a chain of cyclic dependencies. These are files that have a fan-out that's higher than the median fan-out in the revision and a fan-in that's higher than the median fan-in in the revision. Highly interconnected files are naturally correlated with propagation, but provide alternative ways of looking at complexity. For more, see <a href='http://almossawi.com/firefox/prose/'>this</a>. <b>Lower is better.</b>",
                data: data,
                width: global.trunk.width,
                height: global.trunk.height,
                xax_count: global.trunk.xax_count,
                right: global.trunk.right,
                format: 'perc',
                target: '#core',
                full_width: true,
                x_accessor: 'date',
                y_accessor: 'core',
                linked: true,
                mouseover: mouseover()
            });

            var files_min = d3.min(data, function(d) { return d.files; });
            files_min -=  files_min * 0.01;
            var files_max = +d3.max(data, function(d) { return d.files; }) + 10;

            MG.data_graphic({
                title: "Files",
                description: "The number of files in the revision that match our <a href='data/filter.txt'>set of filters</a>, minus tests and forked code, which currently includes <i>ipc/chromium</i>. <b>Lower is better.</b>",
                data: data,
                width: global.trunk.width,
                height: global.trunk.height,
                xax_count: global.trunk.xax_count,
                right: global.trunk.right,
                target: '#files',
                full_width: true,
                x_accessor: 'date',
                y_accessor: 'files',
                linked: true,
                mouseover: mouseover()
            });

            //keep track of mouseouts
            var mouseouts = d3.selectAll('.mg-rollover-rect rect').on('mouseout');

            //did we click to lock?
            d3.selectAll('.mg-rollover-rect rect')
                .on('click', function(d) {
                    window.open('https://hg.mozilla.org/mozilla-central/rev/' + global.activeRevision, '_blank');
                });
        });
    }
}());