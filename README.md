## MongoDB Data Collection Script
---
This repository is a data collection script for MongoDB deployments used with the [mongodb-mongosh](https://github.com/mongodb-js/mongosh) package.


### Requirements:

* [MongoDB Shell](https://docs.mongodb.com/mongodb-shell/)
* [Docker](https://www.docker.com/) [optional]



### Setup
---
1. Install MongoDB Shell following the instructions [here](https://docs.mongodb.com/mongodb-shell/install/) based on your platform. This has been tested primarily in Linux platforms.

2. Clone this repository

    ```
    git clone https://github.com/riveraja/psmdb-collector
    cd psmdb-collector/
    ```
3. Create path to save files
    ```
    mkdir /tmp/pt/collected/
    ```

4. Login to mongodb and load the script

    ```
    mongosh "<MONGODB_URI>" --shell percona-collector.js
    ```


### Running with Docker

1. Clone this repository
    ```
    git clone https://github.com/riveraja/psmdb-collector
    cd psmdb-collector/
    ```

2. Build the docker image
    ```
    docker build -t psmdb-collector:latest .
    ```

3. Execute docker run command
    ```
    docker run -it -v /tmp/pt/collected:/tmp/pt/collected --rm psmdb-collector mongosh "<MONGODB_URI>" --shell percona-collector.js
    ```
    You can use a different host path for the volume mount but guest volume mount path should be exactly the same.



Sample shell login:

```
[root@pmm psmdb-collector]# docker run -it -v /tmp/collector:/tmp/pt/collected/ --rm psmdb-collector mongosh "mongodb://10.84.148.252:27017/" --shell percona-collector.js
Current Mongosh Log ID:	60e16c3b3b6ccc1d0a2ce55a
Connecting to:		mongodb://10.84.148.252:27017/?directConnection=true
Using MongoDB:		4.2.14-15
Using Mongosh Beta:	0.15.5

For mongosh info see: https://docs.mongodb.com/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting:
   2021-06-23T05:58:18.781+0000:
   2021-06-23T05:58:18.781+0000: ** WARNING: Access control is not enabled for the database.
   2021-06-23T05:58:18.782+0000: **          Read and write access to data and configuration is unrestricted.
   2021-06-23T05:58:18.782+0000: **          You can use percona-server-mongodb-enable-auth.sh to fix it.
   2021-06-23T05:58:18.782+0000: ** WARNING: You are running this process as the root user, which is not recommended.
   2021-06-23T05:58:18.782+0000:
------

Loading file: percona-collector.js
[direct: mongos] test>
```

### Available functions
---
percona_collector.collectCurrentOp(count=1,interval=1000)

percona_collector.collectServerStatus(count=1,interval=1000)

percona_collector.getCurrentOp

percona_collector.getDbReplicationInfo

percona_collector.getRsReplicationInfo

percona_collector.getRsSecondaryReplicationInfo

percona_collector.getServerStatus

percona_collector.hostInfo

percona_collector.parameterInfo

percona_collector.pbmCollector

percona_collector.replicaSetInfo

percona_collector.replicationConfiguration

percona_collector.shardInfo

percona_collector.startupOptions

percona_collector.clusterWideInfo [TODO]

Generated files will be stored in the host volume mount path. Ensure that docker can read/write to this directory in the host path.