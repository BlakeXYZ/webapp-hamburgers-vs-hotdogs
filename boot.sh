# #!/usr/bin/env bash
# # boot.sh

# host="$1"
# shift
# port="$1"
# shift

# until nc -z "$host" "$port"; do
#   echo "Waiting for $host:$port..."
#   sleep 2
# done

# exec "$@"


# #!/bin/bash
# while true; do
#     flask db upgrade
#     if [[ "$?" == "0" ]]; then
#         break
#     fi
#     echo Upgrade command failed, retrying in 5 secs...
#     sleep 5
# done
# exec gunicorn -b :5000 --access-logfile - --error-logfile - microblog:app