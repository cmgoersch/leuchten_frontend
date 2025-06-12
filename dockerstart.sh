#!/bin/sh
sed -i -e "s/localhost:3000/$BACKEND_URL/g" /usr/share/nginx/html/script.js
nginx -g "daemon off;"
