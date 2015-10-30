import understand
import sys

def projectMetrics(db):
    metrics = db.metric(db.metrics())

    print "SumCyclomatic,CountLine,CountLineCode"
    print metrics("SumCyclomatic","CountLine","CountLineCode")
    #for k,v in sorted(metrics.items()):
    #    print (k,"=",v)

if __name__ == '__main__':
    # Open Database
    args = sys.argv
    db = understand.open(args[1])
    projectMetrics(db)