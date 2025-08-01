#!/bin/sh
echo "Making migrations and migrating the database."
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput
exec "$@"
