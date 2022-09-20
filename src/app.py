#!/usr/bin/env python

import logging

from flask import Flask, render_template
from pylogus import logger_init

from status_table import StatusData, StatusTable
from utils import js_tool

app = Flask(__name__)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

logger = logger_init(__name__, logging.INFO)



#---------------------- Main page --------------
status_table = StatusTable()
@app.before_first_request
def init():
    logger.info("Hello")

@app.route('/')
def index():
    return render_template('index.html', js=js_tool.get_js_render(), status_table=status_table.upd_table(StatusData().rnd()))

@app.route('/update_info_table')
def upd_status():
    return status_table.response()
#----------------------

def main():
    app.run(host="0.0.0.0", port=5000, debug=False)

if __name__ == "__main__":
    main()
