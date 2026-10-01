FROM nginx:alpine
COPY src/ /usr/share/nginx/html/
# unveränderte Vorlage, aus der dockerstart.sh bei jedem Start script.js erzeugt
RUN cp /usr/share/nginx/html/script.js /usr/local/share/script.js.template
EXPOSE 80
ADD dockerstart.sh /usr/local/bin
RUN chmod +x /usr/local/bin/dockerstart.sh
CMD ["dockerstart.sh"]
