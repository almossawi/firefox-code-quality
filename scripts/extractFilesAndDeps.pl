#!/usr/bin/perl

my @filenames;
my @dependencies;
my %filenamesHash = {};

$numArgs = $#ARGV + 1;
if($#ARGV != 0) {
    print "Usage: $0 <inputFile>\n";
    exit 1;
}

$iFile = $ARGV[0];
$fFile = $iFile . ".files";
$dFile = $iFile . ".deps";

print "Input file:         $iFile\n";
print "Filenames file:     $fFile\n";
print "Dependency file:    $dFile\n";

################################################
#
# Parse through FileDependencyCSV file created by Understand C.
# This file can be created for a project by looking in the 'Dependency' tab   
# 
# This next section of code parses that file (from STDIN) and creates a
# list of all the source code files in the project.
#
################################################

open(INFILE,      "$iFile")  or die "Could not open file $iFile for reading.";
while(<INFILE>)
{
    next unless $. > 1;
    chomp;
    @strings = split(/\,/, $_);
    push(@filenames, @strings[0]);
    push(@filenames, @strings[1]);
}
close(INFILE);

################################################
#
# Sort the source code filenames alphabetically and remove duplicates.
#
################################################

@filenames = sort(@filenames);
$prev = 'nonesuch';
@filenames = grep($_ ne $prev && (($prev) = $_), @filenames);


################################################
#
# Put the filenames into a hash so that we can index them later.
# Write the list out to the .files file.
#
################################################

open(FILES_OUTFILE, ">$fFile") or die "Could not open file $fFile for writing.";
$i = 1;
foreach $str(@filenames) {
  $filenamesHash{$str} = $i;
  $i++;
  my $relStr = $str;
  $relStr    =~ s!/Users/dansturtevant/Downloads/source/hadoop/tags/tags/release-[^/]+/!!;
  #$relStr    =~ s!/Users/!!;
  print FILES_OUTFILE ($relStr . "\n");
}
close(FILES_OUTFILE);


################################################zs
#
# Create .deps file by looking through input file and replacing names
# with the index numbers created in the hash data structure.
#
################################################


open(INFILE,        "$iFile")  or die "Could not open file $iFile for reading.";
open(DEPS_OUTFILE,  ">$dFile") or die "Could not open file $dFile for writing.";

while(<INFILE>)
{
    next unless $. > 1;
    chomp;
    @strings = split(/\,/, $_);
    $from    = @strings[0];
    $to      = @strings[1];
    $number  = @strings[2];

    print DEPS_OUTFILE ($filenamesHash{$from} . ",");
    print DEPS_OUTFILE ($filenamesHash{$to}   . ",");
    print DEPS_OUTFILE ($number . "\n");

}
close(INFILE);
close(DEPS_OUTFILE);

exit;
