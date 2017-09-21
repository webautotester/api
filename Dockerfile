FROM ubuntu
MAINTAINER Xavier Blanc <blancxav@gmail.com>

# Install node
RUN apt-get update -y \
	&& apt-get install curl -y
RUN curl -o /usr/local/bin/n https://raw.githubusercontent.com/visionmedia/n/master/bin/n
RUN chmod +x /usr/local/bin/n
RUN n latest

RUN mkdir /tmp/front
WORKDIR /tmp/front

RUN mkdir dev
COPY dev/*.js dev/

RUN mkdir dev/app
COPY dev/app/*.html dev/app/

RUN mkdir dev/app/js
COPY dev/app/js/*.js dev/app/js/
COPY dev/app/js/*.jsx dev/app/js/

RUN mkdir dev/app/img
COPY dev/app/img/*.png dev/app/img/

RUN mkdir dev/routes
COPY dev/routes/*.js dev/routes/

COPY webpack.config.js .
COPY .babelrc .
COPY package.json .

RUN npm install
RUN npm run build

COPY dev/app/img/demo.mp4 ops/app/img/

WORKDIR /tmp/front/ops

EXPOSE 80

CMD ["node","server.js","--mongo=mongo", "--scheduler=scheduler"]


