# syntax=docker/dockerfile:1
FROM ubuntu:20.04
LABEL author="Jericho Rivera"
LABEL version="1.0"

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /root
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git gnupg wget && \
    wget -qO - https://downloads.mongodb.com/compass/mongosh-1.0.1-linux-x64.tgz | tar -C /usr/local/bin -xzf - && \
    apt-get update && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs npm && \
    mkdir /root/psmdb-collector
COPY package.json percona-collector.js /root/psmdb-collector/
WORKDIR /root/psmdb-collector/
RUN npm install
CMD ["bash"]