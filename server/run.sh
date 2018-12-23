#! /bin/bash

gunicorn -b localhost:8000 -w 3 -k gevent youtube2mp3:app
