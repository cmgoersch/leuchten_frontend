#!/bin/sh
sed -e "s|http://localhost:3000|$BACKEND_URL|g" /usr/local/share/script.js.template > /usr/share/nginx/html/script.js
nginx -g "daemon off;"
