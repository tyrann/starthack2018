import requests
import logging
import json
import six
import sys

occupancies = {
    None: '',
    -1: '',
    0: 'Low',  # todo check
    1: 'Low',
    2: 'Medium',
    3: 'High',
}
API_URL = 'http://transport.opendata.ch/v1'

def _api_request_from_to(city1, city2):
    """
    Perform an API request on transport.opendata.ch
    """
    # Send request
    url = "{}/{}".format(API_URL, 'connections')
    kwargs = {'params': 'from=' + city1 + '&to=' + city2}
    print(kwargs)
    try:
        response = requests.get(url, **kwargs)
    except requests.exceptions.ConnectionError:
        perror('Error: Could not reach network.')
        sys.exit(1)

    # Check response status
    logging.debug('Response status: {0!r}'.format(response.status_code))
    if not response.ok:
        verbose_status = requests.status_codes._codes[response.status_code][0]
        perror('Server Error: HTTP {} ({})'.format(response.status_code, verbose_status))
        sys.exit(1)

    # Convert response to json
    try:
        duration = response.json()['connections'][0]['duration']
        # json.loads(response.text)
        return duration
    except ValueError:
        logging.debug('Response status code: {0}'.format(response.status_code))
        logging.debug('Response content: {0!r}'.format(response.content))
        perror('Error: Invalid API response (invalid JSON)')
        sys.exit(1)

def _api_request(action, params, proxy=None):
    """
    Perform an API request on transport.opendata.ch
    """
    # Send request
    url = "{}/{}".format(API_URL, action)
    kwargs = {'params': params}
    print(kwargs)
    if proxy is not None:
        kwargs['proxies'] = {'http': proxy}
    try:
        response = requests.get(url, **kwargs)
    except requests.exceptions.ConnectionError:
        perror('Error: Could not reach network.')
        sys.exit(1)

    # Check response status
    logging.debug('Response status: {0!r}'.format(response.status_code))
    if not response.ok:
        verbose_status = requests.status_codes._codes[response.status_code][0]
        perror('Server Error: HTTP {} ({})'.format(response.status_code, verbose_status))
        sys.exit(1)

    # Convert response to json
    try:
        duration = response.json()['connections'][0]['duration']
        # json.loads(response.text)
        return duration
    except ValueError:
        logging.debug('Response status code: {0}'.format(response.status_code))
        logging.debug('Response content: {0!r}'.format(response.content))
        perror('Error: Invalid API response (invalid JSON)')
        sys.exit(1)
