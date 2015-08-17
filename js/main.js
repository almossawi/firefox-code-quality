(function() {
    'use strict'

    var trunk = {
        width: 360,
        height: 200,
        left: 0,
        right: 60,
        xax_count: 4
    }

    var mouseover = function() {
        return function(d, i) {
            d3.select('.revision-data')
                .html('Revision <a target="_blank" href="https://hg.mozilla.org/mozilla-central/rev/' + d.revision + '">' + d.revision + '</a> analyzed on ' + d.date);
        };
    }

    d3.csv('data/full_metrics.csv', function(data) {
        data = MG.convert.date(data, 'date', '%Y-%m-%dT%H:%M:%SZ');
        data.map(function(d) {
             d.mccabe = d.SumCyclomatic / d.CountLineCode * 1000;
             d.core = d.core_size / d.files;
             d.dependencies_per_10k = d.first_order_density * d.files;
        });

        MG.data_graphic({
            title: "Lines of code",
            description: "LOC measures the number executable lines of code in each revision, ignoring comments and blank lines. LOC and defect density have an inverse relationship due to architecture not changing at the same rate as LOC and architectural elements such as interfaces having a higher propensity for defects than individual components. <b>Lower is better.</b>",
            data: data,
            width: trunk.width,
            height: trunk.height,
            xax_count: trunk.xax_count,
            right: trunk.right,
            target: '#loc',
            interpolate: 'basic',
            full_width: true,
            x_accessor: 'date',
            y_accessor: 'CountLineCode',
            linked: true,
            mouseover: mouseover()
        });

        MG.data_graphic({
            title: "Cyclomatic complexity",
            description: "Cyclomatic complexity measures the number of linearly independent paths within a software system and can be applied either to the entire system or to a particular class or function. In our measure of cyclomatic complexity, we control for size and hence, the value for each revision is per 1,000 LOC. <b>Lower is better.</b>",
            data: data,
            width: trunk.width,
            height: trunk.height,
            xax_count: trunk.xax_count,
            right: trunk.right,
            target: '#mccabe',
            interpolate: 'basic',
            full_width: true,
            x_accessor: 'date',
            y_accessor: 'mccabe',
            linked: true,
            mouseover: mouseover()
        });

        MG.data_graphic({
            title: "Dependencies",
            description: "First-order density measures the number of direct dependencies between files. Here, we show dependencies as the number of files that a randomly chosen file can directly impact. <b>Lower is better.</b>",
            data: data,
            width: trunk.width,
            height: trunk.height,
            xax_count: trunk.xax_count,
            right: trunk.right,
            target: '#dependencies',
            interpolate: 'basic',
            full_width: true,
            x_accessor: 'date',
            y_accessor: 'dependencies_per_10k',
            linked: true,
            mouseover: mouseover()
        });

        MG.data_graphic({
            title: "Propagation",
            description: "Propagation measures direct as well as indirect dependencies between files in a codebase. In practical terms, it gives a sense of the actual reach of a change to a randomly chosen file. <b>Lower is better.</b>",
            data: data,
            width: trunk.width,
            height: trunk.height,
            xax_count: trunk.xax_count,
            right: trunk.right,
            format: 'perc',
            target: '#prop-cost',
            interpolate: 'basic',
            full_width: true,
            x_accessor: 'date',
            y_accessor: 'prop_cost',
            linked: true,
            mouseover: mouseover()
        });

        MG.data_graphic({
            title: "Highly interconnected files",
            description: "Highly interconnected files are files that are interconnected via a chain of cyclic dependencies. These are files that have a fan-out that's higher than the median fan-out in the revision and a fan-in that's higher than the median fan-in in the revision. <b>Lower is better.</b>",
            data: data,
            width: trunk.width,
            height: trunk.height,
            xax_count: trunk.xax_count,
            right: trunk.right,
            format: 'perc',
            target: '#core',
            interpolate: 'basic',
            full_width: true,
            x_accessor: 'date',
            y_accessor: 'core',
            linked: true,
            mouseover: mouseover()
        });

        MG.data_graphic({
            title: "Files",
            description: "The number of files in the revision that match our filter, minus tests. The current filter is: <i>.c, .C, .cc, .cpp, .css, .cxx, .h, .H, .hh, .hpp, .htm, .html, .hxx, .inl, .java, .js, .jsm, .py, .s, .xml</i>. <b>Lower is better.</b>",
            data: data,
            width: trunk.width,
            height: trunk.height,
            xax_count: trunk.xax_count,
            right: trunk.right,
            target: '#files',
            interpolate: 'basic',
            full_width: true,
            x_accessor: 'date',
            y_accessor: 'files',
            linked: true,
            mouseover: mouseover()
        });
    });
}());