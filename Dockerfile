FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY index.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY *.html /usr/share/nginx/html/
COPY robots.txt sitemap.xml site.webmanifest /usr/share/nginx/html/

EXPOSE 80

# 👇 ESTO ES LA CLAVE
HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget -q -O - http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
