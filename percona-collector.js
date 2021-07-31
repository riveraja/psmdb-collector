const fs = require('fs');
const Console = require('console');
const Chalk = require('chalk');

const Path = "samples/";

var percona_collector = {};

function isMongos() {
    if ((typeof db.isMaster().msg) !== 'undefined') {
        return true
    }
}

function isReplicaset() {
    if ((typeof db.isMaster().primary) === 'string') {
        return true
    }
}

function getDatabases() {
    return db.adminCommand({ listDatabases: 1 }).databases.map( function(doc) { return doc.name });
}

function writeMe(filename='',output='',my_flag='') {
    outFile=(Path + filename);
    fs.writeFileSync(outFile, JSON.stringify(output), {flag: my_flag});
    // fs.writeFile(outFile, JSON.stringify(output), {flag: my_flag}, function(err) {
    //     if(err) print('error', err);
    // });
}

percona_collector.collectServerStatus = function(count=1,interval=1000) {
    print("Continuous collection of serverStatus metrics in progress...")
    fs.rm(Path + "serverStatusAll.json", { force: true }, function(err) {
        if(err) print('error', err);
    });
    var output = '';
    for (let step =0; step < count; step++) {
        var output = db.serverStatus();
        writeMe(filename='serverStatusAll.json',output=output,my_flag='a');
        sleep(interval);
    }
    print("Continuous collection done.")
}

percona_collector.collectCurrentOp = function(count=1,interval=1000) {
    print("Continuous collection of currentOp metrics in progress...");
    fs.rm(Path + "currentOpAll.json", { force: true }, function(err) {
        if(err) print('error', err);
    });
    var output = '';
    for (let step =0; step < count; step++) {
        var output = db.currentOp();
        writeMe(filename='currentOpAll.json',output=output,my_flag='a');
        sleep(interval);
    }
    print("Continuous collection done.")
}

percona_collector.pbmCollector = async function() {
    var pbm_backups = await db.getSiblingDB('admin').pbmBackups.find().toArray();
    writeMe(filename='pbmBackupsCollection.json',output=pbm_backups,my_flag='w+');

    var pbm_agents = await db.getSiblingDB('admin').pbmAgents.find().toArray();
    writeMe(filename='pbmAgentsCollection.json',output=pbm_agents,my_flag='w+');

    var pbm_config = await db.getSiblingDB('admin').pbmConfig.find().toArray();
    writeMe(filename='pbmConfigCollection.json',output=pbm_config,my_flag='w+');

    var pbm_cmd = await db.getSiblingDB('admin').pbmCmd.find().toArray();
    writeMe(filename='pbmCmdCollection.json',output=pbm_cmd,my_flag='w+');

    var pbm_lock = await db.getSiblingDB('admin').pbmLock.find().toArray();
    writeMe(filename='pbmLockCollection.json',output=pbm_lock,my_flag='w+')

    var pbm_lockop = await db.getSiblingDB('admin').pbmLockOp.find().toArray();
    writeMe(filename='pbmLockOpCollection.json',output=pbm_lockop,my_flag='w+')

    var pbm_log = await db.getSiblingDB('admin').pbmLog.find().toArray();
    writeMe(filename='pbmLogCollection.json',output=pbm_log,my_flag='w+')

    var pbm_oplog = await db.getSiblingDB('admin').pbmOpLog.find().toArray();
    writeMe(filename='pbmOpLogCollection.json',output=pbm_oplog,my_flag='w+')

    var pbm_pitrchunks = await db.getSiblingDB('admin').pbmPITRChunks.find().toArray();
    writeMe(filename='pbm_PITRChunksCollection.json',output=pbm_pitrchunks,my_flag='w+')

    var pbm_pitrstate = await db.getSiblingDB('admin').pbmPITRState.find().toArray();
    writeMe(filename='pbmPITRStateCollection.json',output=pbm_pitrstate,my_flag='w+');

    var pbm_status = await db.getSiblingDB('admin').pbmStatus.find().toArray();
    writeMe(filename='pbmStatusCollection.json',output=pbm_status,my_flag='w+');
}

percona_collector.hostInfo = function() {
    var output = db.hostInfo();
    writeMe(filename='hostInfo.json',output=output,my_flag='w+');
    return output;
}

percona_collector.getServerStatus = function() {
    var output = db.serverStatus();
    writeMe(filename='serverStatus.json',output=output,my_flag='w+');
    return output;
}

percona_collector.getCurrentOp = function() {
    var output = db.adminCommand({ currentOp: true });
    writeMe(filename='currentOp.json',output=output,my_flag='w+');
    return output;
}

percona_collector.parameterInfo = function() {
    var output = db.adminCommand({ getParameter: '*' });
    writeMe(filename='getParameter.json',output=output,my_flag='w+');
    return output;
}

percona_collector.startupOptions = function() {
    var output = db.adminCommand({ getCmdLineOpts: 1 });
    writeMe(filename='cmdLineOpts.json',output=output,my_flag='w+');
    return output;
}

percona_collector.replicaSetInfo = function() {
    if (!isReplicaset()) {
        printjson("not a replicaset");
    } else {
        var output = rs.status();
        writeMe(filename='rsStatus.json',output=output,my_flag='w+');
        return output;
    }
}

percona_collector.replicationConfiguration = function() {
    if (!isReplicaset()) {
        printjson("not a replicaset");
    } else {
        var output = rs.conf();
        writeMe(filename='rsConf.json',output=output,my_flag='w+');
        return output;
    }
}

percona_collector.shardInfo = function(bool) {
    if (!isMongos()) {
        printjson("not a shard cluster!");
    } else {
        var shards = sh.status(bool);
        writeMe(filename='shStatus.json',output=output,my_flag='w+');
        return shards;
    }
}

percona_collector.getDbReplicationInfo = function() {
    if (!isReplicaset()) {
        printjson("not a replicaset");
    } else {
        var output = db.getReplicationInfo();
        writeMe(filename='getReplicationInfo.json',output=output,my_flag='w+');
        return output;
    }
}

percona_collector.getRsReplicationInfo = function() {
    if (!isReplicaset()) {
        printjson("not a replicaset");
    } else {
        var output = rs.printReplicationInfo();
        writeMe(filename='printReplicationInfo.json',output=output,my_flag='w+');
        return output;
    }
}

percona_collector.getRsSecondaryReplicationInfo = function() {
    if (!isReplicaset()) {
        printjson("not a replicaset");
    } else {
        var output = rs.printSecondaryReplicationInfo();
        writeMe(filename='printSecondaryReplicationInfo.json',output=output,my_flag='w+');
        return output;
    }
}


// TODO
percona_collector.clusterWideInfo = function() {
    var dbList = getDatabases();
    var collCount = 0;
    for (const idx in dbList) {
        var t = db.getSiblingDB(dbList[idx]).runCommand({ listCollections: 1, nameOnly: true }).cursor.firstBatch.length
        collCount += t;
    }
    var shardedCollCount = db.getSiblingDB('config').chunks.aggregate({$group:{_id:"$ns",count:{$sum:1}}}).toArray().length;
    print("Database count: " + dbList.length);
    print("Collection count: " + collCount);
    print("Sharded Collections: " + shardedCollCount);
    print("Unsharded Collections: " + (collCount - shardedCollCount) );
}

percona_collector.collectionStats = function(dbName='',collName='',scaleFactor=1) {
    var mydb = db.getSiblingDB(dbName);
    var output = mydb.runCommand({ collStats: collName, scale: scaleFactor });
    writeMe(filename='collectionStats.json',output=output,my_flag='w+');
    return output;
}

percona_collector.summarize = function() {

    if (isMongos() || isReplicaset()) {
        Console.log(Chalk.red.bold(
            "\n+--------------------------------------------+" +
            "\n| Concurrent Transactions Available Tickets  |" +
            "\n+--------------------------------------------+"
            ));
        Console.table(db.serverStatus().wiredTiger.concurrentTransactions);
    }

    if (isReplicaset() && !isMongos()) {
        Console.log(Chalk.red.bold(
            "\n+--------------------------------------------+" +
            "\n| Replication Statistics                     |" +
            "\n+--------------------------------------------+"
            ));
        print(db.serverStatus({repl:1}).repl)
    }

    if (isMongos() && !isReplicaset()) {
        Console.log(Chalk.red.bold(
            "\n+--------------------------------------------+" +
            "\n| Sharding Statistics                        |" +
            "\n+--------------------------------------------+"
            ));
        print(db.serverStatus().shardingStatistics)
    }

    if (!isMongos()) {
        Console.log(Chalk.red.bold(
            "\n+--------------------------------------------+" +
            "\n| Server Status GlobalLocks                  |" +
            "\n+--------------------------------------------+"
            ));
        print(db.serverStatus().globalLock)
    }

}

percona_collector.schemaInfo = async function(myObj=[]) {
    const oneRow = await db.getSiblingDB(myObj[0]).getCollection(myObj[1]).findOne();
    const allIndexes = await db.getSiblingDB(myObj[0]).getCollection(myObj[1]).getIndexes();
    const allStats = await db.getSiblingDB(myObj[0]).getCollection(myObj[1]).stats();

    Console.log(Chalk.red.bold(
        "\n+--------------------------------------------+" +
        "\n| Sample data                                |" +
        "\n+--------------------------------------------+"
        ));
    Console.log(oneRow);

    Console.log(Chalk.red.bold(
        "\n+--------------------------------------------+" +
        "\n| All Indexes for collection                 |" +
        "\n+--------------------------------------------+"
        ));
    Console.log(allIndexes);

    Console.log(Chalk.red.bold(
        "\n+--------------------------------------------+" +
        "\n| Collection statistics                      |" +
        "\n+--------------------------------------------+"
        ));
    Console.log(allStats);
}