import os
import tarfile
import urllib.request

url = 'https://hg.mozilla.org/mozilla-central/archive/tip.tar.gz'
outFilePath = 'understand_in'

# get new source
urllib.request.urlretrieve(url, outFilePath + '/tip.tar.gz')

tar = tarfile.open(outFilePath + '/tip.tar.gz', 'r:gz')
tar.extractall(outFilePath)
tar.close()
os.remove(outFilePath + '/tip.tar.gz')