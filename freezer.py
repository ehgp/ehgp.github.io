"""Freeze page for Github Pages."""
from flask_frozen import Freezer
from website import app

freezer = Freezer(app)

if __name__ == "__main__":
    freezer.freeze()
