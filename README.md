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
2. Performs static analysis on the codebase to get LOC, cyclomatic complexity and dependency data (``projectMetrics.pl``)
3. Generates a hash table from the dependency data (``extractFilesAndDeps.pl``)
4. Gets dependencies, propagation cost and highly-interconnected files data (``main_metrics_generator.m``)
5. Writes the entire set of data to be graphed to ``metrics_out/full_metrics-all.csv`` (``addToFullMetrics.py``)

The script then goes through the above steps for each of the modules in ``data/modules.txt``.

### Dependencies endpoint

To get the set of files that depend on some arbitrary file in the latest revision (fan-in) or the files that that file depends on (fan-out), you can call the following endpoint, with a ``filename`` argument and an optional ``download`` argument:

``https://metrics.mozilla.com/code-quality/dep/?filename=xpcom/glue/nsINIParser.cpp&download=false``

The response is a JSON file like this:

```javascript
{
  "file": "xpcom/glue/nsINIParser.cpp",
  "fanIn": [
    "toolkit/system/androidproxy/nsAndroidSystemProxySettings.cpp",
    "toolkit/xre/EventTracer.cpp",
    "toolkit/xre/nsAppRunner.h",
    "toolkit/xre/nsXREDirProvider.h",
    "webapprt/prefs.js",
    "widget/BasicEvents.h",
    "xpcom/ds/nsINIParserImpl.h",
    "xulrunner/app/xulrunner.js",
    "xulrunner/tools/redit/redit.cpp"
  ],
  "fanOut": [
    "accessible/atk/AccessibleWrap.h",
    "xpcom/base/nsErrorService.cpp",
    "xpcom/glue/nsCategoryCache.cpp",
    "xpcom/glue/nsDeque.cpp",
    "xpcom/glue/nsISupportsImpl.cpp"
  ]
}
```

If a filename cannot be found, the resulting JSON object will look like this:

```javascript
{
  error: 'File name missing or does not exist in the codebase, usage: https://metrics.mozilla.com/code-quality/dep/?filename=xpcom/glue/nsINIParser.cpp'
}
```

Once [this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1196279) is resolved, the endpoint will respond with the proper content type and there will be no need for the ``download`` argument. That server doesn't currently have node installed.


### Requirements

* Scitools' Understand
* MATLAB (to be replaced by Python)
* Perl (to be replaced by Python)
* Python

### Demo
[https://metrics.mozilla.com/code-quality](https://metrics.mozilla.com/code-quality)
