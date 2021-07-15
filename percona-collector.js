const localReq = require('module').createRequire(__filename);
const fs = localReq('fs');
const _ = localReq('lodash');
const Console = localReq('console');
const Chalk = localReq('chalk');

var percona_collector = {};

function isMongos() {
    return (db.isMaster().msg == "isdbgrid");
}

function getDatabases() {
    return db.adminCommand({ listDatabases: 1 }).databases.map( function(doc) { return doc.name });
}

function writeMe(filename='',output='',my_flag='') {
    outFile=("/tmp/pt/collected/" + filename);
    fs.writeFile(outFile, JSON.stringify(output), {flag: my_flag}, function(err) {
        if(err) print('error', err);
    });
}

percona_collector.collectServerStatus = function(count=1,interval=1000) {
    print("Continuous collection of serverStatus metrics in progress...")
    fs.rm("/tmp/pt/collected/serverStatusAll.json", { force: true }, function(err) {
        if(err) print('error', err);
    });
    var output = '';
    for (let step =0; step < count; step++) {
        var res = db.serverStatus();
        output = JSON.stringify(res) + "\n";
        writeMe(filename='serverStatusAll.json',output=output,my_flag='a');
        sleep(interval);
    }
    print("Continuous collection done.")
}

percona_collector.collectCurrentOp = function(count=1,interval=1000) {
    print("Continuous collection of currentOp metrics in progress...");
    fs.rm("/tmp/pt/collected/currentOpAll.json", { force: true }, function(err) {
        if(err) print('error', err);
    });
    var output = '';
    for (let step =0; step < count; step++) {
        var res = db.currentOp();
        output = JSON.stringify(res) + "\n";
        writeMe(filename='currentOpAll.json',output=output,my_flag='a');
        sleep(interval);
    }
    print("Continuous collection done.")
}

percona_collector.pbmCollector = function() {
    var pbm_backups = db.getSiblingDB('admin').pbmBackups.find().toArray();
    writeMe(filename='pbmBackupsCollection.json',output=output,my_flag='w+');

    var pbm_agents = db.getSiblingDB('admin').pbmAgents.find().toArray();
    writeMe(filename='pbmAgentsCollection.json',output=output,my_flag='w+');

    var pbm_config = db.getSiblingDB('admin').pbmConfig.find().toArray();
    writeMe(filename='pbmConfigCollection.json',output=output,my_flag='w+');

    var pbm_cmd = db.getSiblingDB('admin').pbmCmd.find().toArray();
    writeMe(filename='pbmCmdCollection.json',output=output,my_flag='w+');

    var pbm_lock = db.getSiblingDB('admin').pbmLock.find().toArray();
    writeMe(filename='pbmLockCollection.json',output=output,my_flag='w+')

    var pbm_lockop = db.getSiblingDB('admin').pbmLockOp.find().toArray();
    writeMe(filename='pbmLockOpCollection.json',output=output,my_flag='w+')

    var pbm_log = db.getSiblingDB('admin').pbmLog.find().toArray();
    writeMe(filename='pbmLogCollection.json',output=output,my_flag='w+')

    var pbm_oplog = db.getSiblingDB('admin').pbmOpLog.find().toArray();
    writeMe(filename='pbmOpLogCollection.json',output=output,my_flag='w+')

    var pbm_pitrchunks = db.getSiblingDB('admin').pbmPITRChunks.find().toArray();
    writeMe(filename='pbm_PITRChunksCollection.json',output=output,my_flag='w+')

    var pbm_pitrstate = db.getSiblingDB('admin').pbmPITRState.find().toArray();
    writeMe(filename='pbmPITRStateCollection.json',output=output,my_flag='w+');

    var pbm_status = db.getSiblingDB('admin').pbmStatus.find().toArray();
    writeMe(filename='pbmStatusCollection.json',output=output,my_flag='w+');
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
    var output = rs.status();
    writeMe(filename='rsStatus.json',output=output,my_flag='w+');
    return output;
}

percona_collector.replicationConfiguration = function() {
    var output = rs.conf();
    writeMe(filename='rsConf.json',output=output,my_flag='w+');
    return output;
}

percona_collector.shardInfo = function(bool) {
    var shards = '';
    if (!isMongos()) {
        printjson("not a shard cluster!");
    } else {
        var shards = sh.status(bool);
        writeMe(filename='shStatus.json',output=output,my_flag='w+');
    }
    return shards;
}

percona_collector.getDbReplicationInfo = function() {
    var output = db.getReplicationInfo();
    writeMe(filename='getReplicationInfo.json',output=output,my_flag='w+');
    return output;
}

percona_collector.getRsReplicationInfo = function() {
    var output = rs.printReplicationInfo();
    writeMe(filename='printReplicationInfo.json',output=output,my_flag='w+');
    return output;
}

percona_collector.getRsSecondaryReplicationInfo = function() {
    var output = rs.printSecondaryReplicationInfo();
    writeMe(filename='printSecondaryReplicationInfo.json',output=output,my_flag='w+');
    return output;
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
    Console.log(Chalk.red.bold( "\n+--------------------------------------------+" +
                                "\n| Concurrent Transactions Available Tickets  |" +
                                "\n+--------------------------------------------+"));
    Console.table(db.serverStatus().wiredTiger.concurrentTransactions);

    if (!isMongos()) {
        Console.log(Chalk.red.bold( "\n+--------------------------------------------+" +
                                    "\n| Replication Statistics                     |" +
                                    "\n+--------------------------------------------+"));
        print(db.serverStatus({repl:1}).repl)
    } else {
        
    }

    Console.log(Chalk.red.bold( "\n+--------------------------------------------+" +
                                "\n| Server Status GlobalLocks                  |" +
                                "\n+--------------------------------------------+"));
    print(db.serverStatus().globalLock);
}
