FROM node:lts as base
WORKDIR /app
COPY ./ /app
RUN yarn config set registry 'http://10.0.5.193:8081/repository/ziel-npm-group/' && \
    yarn install && \
    yarn run build 

FROM nginx:latest 

COPY --from=base /app/dist /usr/share/nginx/html