FROM nginx:latest

COPY ./ /usr/share/nginx/html/
RUN rm -rf /usr/share/nginx/html/add
