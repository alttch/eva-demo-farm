if _source:
	g = '{}'.format(_source.group.split('/')[0])
else:
	g = 'greenhouse{0:g}'.format(_1)
# stop manual watering timer
clear('{}/timers/manual_watering'.format(g))
# start the pump
start('{}/pump'.format(g))
