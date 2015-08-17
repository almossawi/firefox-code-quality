#!/bin/bash

cd ~/Desktop/matlab_scripts_firefox_nightly

#get latest source
rm -rf understand_in/*
rm -rf understand_in/*
python getLatestSource.py

#get loc, mccabe and export dependencies
rm currentBuild.udb

und create -db currentBuild.udb -languages c++ Web add -exclude ".*,*test*" understand_in/
und analyze -db currentBuild.udb
uperl projectMetrics.pl -db currentBuild.udb > metrics_out/loc_mccabe_metrics.csv
und export -dependencies file csv perl_in/dependencies.csv -db currentBuild.udb

#process dependencies
./extractFilesAndDeps.pl perl_in/dependencies.csv

#cleanup
rm -rf misc/dependencies.csv.files
rm -rf matlab_in/dependencies.csv.deps

mv perl_in/dependencies.csv.files misc
mv perl_in/dependencies.csv.deps matlab_in

#get architectural metrics
matlab -nodesktop -r main_metrics_generator

#add date and revision number to full_metrics.csv and then data from the other two metrics_out files
python addToFullMetrics.py