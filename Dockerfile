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
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs npm && \
    apt-get install -y mongodb-mongosh && \
    mkdir /root/psmdb-collector
COPY package.json percona-collector.js /root/psmdb-collector/
WORKDIR /root/psmdb-collector/
RUN npm install
CMD ["bash"]