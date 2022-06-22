"""Website Build."""

import os
import datetime
from flask import (
    Flask,
    render_template,
    render_template_string,
    Markup,
    current_app,
    url_for,
    redirect,
)
import markdown2

cfd = os.path.dirname(os.path.realpath(__file__))
app = Flask(__name__)
app.config.from_pyfile("config.py")

# custom jinja functions


@app.context_processor
def utility_processor():
    """Execute Utility Processor."""
    year = datetime.datetime.now().strftime("%Y")
    return dict(year=year)


@app.route("/")
def home():
    """Home Page."""
    home_md = markdown2.markdown_path("content/home.md")
    return render_template("home.html", current_page="Home", home_md=home_md)


@app.route("/me/")
def me():
    """Me Page."""
    return redirect(url_for("about"))


@app.route("/about/")
def about():
    """About Page."""
    about_md = markdown2.markdown_path("content/about.md")
    return render_template("about.html", current_page="About", about_md=about_md)


@app.route("/contact/")
def contact():
    """Contact Page."""
    return render_template("contact.html", current_page="Contact")


@app.route("/my-work/")
def mywork():
    """My Work Page."""
    work_md = markdown2.markdown_path("content/my-work.md")
    return render_template("my-work.html", current_page="My work", work_md=work_md)


@app.route("/resumes/")
def resumes():
    """Resumes Page."""
    return render_template("resume.html", current_page="Resumes")


@app.route("/static/")
def st():
    """Execute Static."""
    return ""


# @app.route("/favicon.ico")
# def favicon():
#     return url_for("static", filename="me-circ.png")


@app.errorhandler(404)
def page_not_found(err):
    """404."""
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)
