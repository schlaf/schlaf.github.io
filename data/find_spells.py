from glob import glob
import sys

def multi():
    ''' Opens all of the WHAC files and makes a file with all unique spells.
    This should be run after checking the individual files for wording
    problems and inconsistancies.
    '''

    files = glob('*.whac')

    recs = set()
    for f in files:
        for line in open(f, 'r'):
            rec = line.strip()
            if rec.startswith('<spell name'):
                recs.add(rec)

# convert back to a list and make sure it is sorted.
    recs = list(recs)
    recs.sort()

    with open('spells_complete.xml', 'w') as f:
        for line in recs:
            f.write(line+'\n')

def single(argv):
    ''' Opens each of the data files and finds all unique spells in each and
    then prints a master list of all spells. Will find duplicate spells if
    the working of the spell is not exactly the same each time. This is
    useful for finding typos or other inconsistancies.

    '''

    recs = set()
    for line in open(argv, 'r'):
        rec = line.strip()
        if rec.startswith('<spell name'):
            recs.add(rec)

# convert back to a list and make sure it is sorted.
    recs = list(recs)
    recs.sort()

    with open('spells_'+argv.split('_')[1].rstrip('.whac')+'.xml', 'w') as f:
        for line in recs:
            f.write(line+'\n')

if __name__ == "__main__":
    if len(sys.argv) == 2:
        single(sys.argv[1])
    elif len(sys.argv) == 1:
        multi()
    else:
        print('Too many arguements!')
