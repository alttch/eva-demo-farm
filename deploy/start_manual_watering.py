gh = 'greenhouse{0:g}'.format(_1)
old_status = status('unit:{}/pump'.format(gh))
start('{}/pump'.format(gh))

# reset pump timer only if we turned it on
if not old_status:
	reset('lvar:{}/timers/manual_watering'.format(gh))
