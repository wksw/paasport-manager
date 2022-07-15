FROM dockerhub.contoso.com/paasport/paasport-manager:build_latest as base

WORKDIR /app

COPY ./ /app/

# http://192.168.6.34:8081/repository/npm-group/
# RUN yarn config set registry 'http://192.168.6.34:8081/repository/npm-group/' && \
RUN cp -r /node_modules /app/ && \
    yarn --verbose info install && \
    rm -rf node_modules/3d-earth/dist && cp -r third_party/3d-earth/dist node_modules/3d-earth/dist && \
    yarn run build 

# RUN  yarn run build

FROM nginx:latest 

COPY --from=base /app/dist /usr/share/nginx/html