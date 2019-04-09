if _source:
        u = '{}/lamp'.format(_source.group.split('/')[0])
else:
        u = 'greenhouse{0:g}/lamp'.format(_1)
stop(u)
