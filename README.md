# Firefox Code Quality
Architectural measures of complexity for revisions in mozilla-central.

The repository includes the now fully-automated workflow for running the code-quality analyses on revisions in mozilla-central.  More documentation to follow.

### Quick-start guide

To run the complete set of analyses on the latest revision in mozilla-central, run this script

```
analyzeMozillaCentral.sh 
```

### Modifying things
* data/modules.txt: contains the set of directories that constitute modules (the current ones may not be accurate)
* data/filter.txt: contains the set of files and directories that we omit from the analysis
* getLatestSource.py: contains the path to the codebase that we'll be analyzing

### How the script works
The script (``analyzeMozillaCentral.sh``) takes approximately 30 minutes to complete. It performs the following tasks:

1. Pulls the latest revision from mozilla-central (``getLatestSource.py``)
2. Performs static analysis on the codebase to get LOC, Cyclomatic complexity and dependency data (``projectMetrics.pl``)
3. Cleans up the dependency data (``extractFilesAndDeps.pl``)
4. Gets dependencies, propagation cost and highly-interconnected files data (``main_metrics_generator.m``)
5. Writes the entire set of data to be graphed to data/full_metrics-all.csv (``addToFullMetrics.py``)

The script then goes through the above steps for each of the modules in ``data/modules.txt``.

Metrics are written to the directory ``metrics_out``:

* full_metrics.csv: includes the entire set of metrics for all processed revisions.
* loc_mccabe_metrics.csv: lines of code and cyclomatic complexity metrics for the last processed revision.
* dependency_metrics.csv: includes metrics for direct dependencies, propagation and highly interconnected files for the last processed revision.

### Requirements

* Scitools' Understand
* MATLAB (to be replaced by Python)
* Perl (to be replaced by Python)
* Python

### Demo
[https://metrics.mozilla.com/code-quality](https://metrics.mozilla.com/code-quality)
