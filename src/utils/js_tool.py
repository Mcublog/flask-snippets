from pathlib import Path

from flask import render_template_string


def render_js(fname):
    with open(fname) as fin:
        script = fin.read()
        rendered_script = render_template_string(script)
        return rendered_script

def get_js_render():
    path = Path().joinpath('src/static/js/index.js')
    return render_js(str(path))

def get_svg_lib():
    path = Path().joinpath('src/static/js/svg.min.js')
    return render_js(str(path))
