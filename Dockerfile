FROM ubuntu
LABEL maintainer="Xavier Blanc <blancxav@gmail.com>"

# Install node
RUN apt-get update -y \
	&& apt-get install curl -y
RUN curl -o /usr/local/bin/n https://raw.githubusercontent.com/visionmedia/n/master/bin/n
RUN chmod +x /usr/local/bin/n
RUN n latest

RUN mkdir /tmp/api
WORKDIR /tmp/api

COPY . .

RUN npm install

EXPOSE 80

CMD ["node","server.js","--mongo=mongo", "--scheduler=scheduler"]


