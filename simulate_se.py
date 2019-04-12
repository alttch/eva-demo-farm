#!/usr/bin/env python3


def simulate_data(stp):
    _stp = stp

    if _stp > 43200:
        _stp = abs(_stp - 86400)

    t_min = 15
    t_max = 27

    h_min = 45
    h_max = 65

    s_min = 65
    s_max = 125

    ldr = '1' if _stp > 25000 else '0'

    return {
        'temp': '{:.1f}'.format(t_min + (t_max - t_min) * _stp / 43200),
        'hum': '{:.1f}'.format(h_max - (h_max - h_min) * _stp / 43200),
        'soilm': '{:.1f}'.format((s_max - (s_max - s_min) * _stp / 43200)),
        'ldr': ldr
    }


def main():
    import argparse

    ap = argparse.ArgumentParser(description='Simulate sensor events')
    ap.add_argument(
        '-t',
        '--time',
        metavar='SEC',
        help='Seconds since day start (0..86400)',
        type=int)
    ap.add_argument(
        '-j', '--json', action='store_true', help='print JSON and exit')
    ap.add_argument(
        '-k', '--api-key', metavar='KEY', help='API key (default: demo123)')
    args = ap.parse_args()

    greenhouses = 2

    if args.time is not None:
        stp = args.time
        if stp < 0 or stp > 86400: raise Exception('Invalid time value')
    else:
        import datetime
        d = datetime.datetime.now()
        stp = d.hour * 3600 + d.minute + d.second

    if args.json:
        import json
        print(json.dumps(data, indent=4, sort_keys=True))
        exit()

    api_key = args.api_key if args.api_key is not None else 'demo123'

    data = simulate_data(stp)

    for gh in range(1, greenhouses + 1):
        from jsonrpcclient import request as jrpc
        from functools import partial
        rpc = partial(
            jrpc,
            'http://10.27.12.10{}:8812/jrpc'.format(gh),
            'update',
            k=api_key,
            s=1)
        for k, v in data.items():
            result = rpc(i='sensor:greenhouse{}/env/{}'.format(gh, k), v=v)
            if not result.data.result.get('ok'):
                raise Exception('Update failed')


if __name__ == '__main__':
    main()
