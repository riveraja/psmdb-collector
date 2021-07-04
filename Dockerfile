# syntax=docker/dockerfile:1
FROM ubuntu:20.04
ENV TZ=Europe/London
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /root
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git gnupg wget && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && \
    apt-get install -y mongodb-mongosh && \
    mkdir /root/psmdb-collector
    # git clone https://github.com/riveraja/psmdb-collector
    # curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh | bash - && \
    # apt-get install -y nodejs npm
COPY ../percona-collector.js /root/psmdb-collector/
WORKDIR /root/psmdb-collector/
# RUN npm install
CMD ["bash"]