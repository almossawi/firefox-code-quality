# Firefox Code Quality
Architectural measures of complexity for revisions in mozilla-central.

The repository includes the now fully-automated workflow for running the code-quality analyses on revisions in mozilla-central.  More documentation to follow.

### Quick-start guide

To run the complete set of analyses on the latest revision in mozilla-central, run this script

```
analyzeMozillaCentral.sh 
```

### Directory structure

The script takes approximately one hour to complete. Metrics are written to the directory ``metrics_out``:

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
