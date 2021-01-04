FROM node:15.5-alpine3.10 as build
WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn install

COPY public /app/public
COPY craco.config.js /app
COPY src /app/src

RUN yarn build

# production environment
FROM nginx:1.19-alpine

COPY --from=build /app/build /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY deployments/nginx.conf.template /etc/nginx/nginx.conf.template
# COPY deployments/web.docker-entrypoint.sh /

# ENTRYPOINT ["sh", "/web.docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
