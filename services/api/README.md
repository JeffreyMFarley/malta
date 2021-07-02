# The Malta API

## Features

## Requirements

## Setup & Running
First, create a virtual environment for Python dependencies:
```
pyenv virtualenv 3.9.0 malta
```

Next, use `pip` to install dependencies, which are defined in `setup.py`:
```
pip install -e '.[testing]'
```

With that, you just need a few additional commands to get up and running:
```
python src/manage.py runserver
```
