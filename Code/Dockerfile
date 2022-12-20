# 设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
# FROM node:lts-alpine as builder

FROM nginx 
# WORKDIR /app

# COPY . /app

# RUN npm run build


RUN mkdir /usr/share/nginx/sense

RUN rm -rf /etc/nginx/conf.d

# comment user directive as master process is run as user in OpenShift random UID
# RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

COPY ./conf.d /etc/nginx/conf.d

# COPY --from=builder /app/build /usr/share/nginx/sense
COPY  ./build /usr/share/nginx/sense

COPY ./env.sh /usr/share/nginx/sense

RUN chmod -R 777 /usr/share/nginx/sense

RUN chmod +x /usr/share/nginx/sense/env.sh

EXPOSE 80

CMD /usr/share/nginx/sense/env.sh

