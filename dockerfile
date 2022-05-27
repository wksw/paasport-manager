FROM dockerhub.contoso.com/paasport/paasport-manager:build_latest as base

WORKDIR /app

COPY ./ /app/

# http://192.168.6.34:8081/repository/npm-group/
# RUN yarn config set registry 'http://192.168.6.34:8081/repository/npm-group/' && \
RUN yarn config set registry 'http://10.0.5.193:8081/repository/ziel-npm-group/' && \
    yarn --verbose add umi && \
    yarn --verbose info install && \
    yarn run build 

# RUN  yarn run build

FROM nginx:latest 

COPY --from=base /app/dist /usr/share/nginx/html