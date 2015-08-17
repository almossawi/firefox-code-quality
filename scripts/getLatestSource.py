import os
import tarfile
import urllib2
import StringIO
import gzip
import shutil

baseURL = 'https://hg.mozilla.org/mozilla-central/archive/'
filename = 'tip.tar.gz'
outFilePath = 'understand_in/mozilla-central-latest.tar'
folder = 'understand_in'

# get new source
response = urllib2.urlopen(baseURL + filename)
compressedFile = StringIO.StringIO()
compressedFile.write(response.read())

compressedFile.seek(0)

decompressedFile = gzip.GzipFile(fileobj=compressedFile, mode='rb')

with open(outFilePath, 'w') as outfile:
    outfile.write(decompressedFile.read())

tar = tarfile.open(outFilePath)
tar.extractall('understand_in')
tar.close()

os.remove(outFilePath)