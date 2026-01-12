FROM nginx:alpine

# Limpiar config por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar SOLO los archivos web
COPY index.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY *.html /usr/share/nginx/html/
COPY robots.txt sitemap.xml site.webmanifest /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
