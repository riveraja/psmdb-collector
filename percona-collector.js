const fs = require('fs');

var percona_collector = {};

function isMongos() {
    return (db.isMaster().msg == "isdbgrid");
}

function getDatabases() {
    return db.adminCommand({ listDatabases: 1 }).databases.map( function(doc) { return doc.name });
}

percona_collector.collectServerStatus = function(count=1,interval=1000) {
    print("Continuous collection of serverStatus metrics in progress...")
    fs.rm("./serverStatusAll.json", { force: true }, function(err) {
        if(err) print('error', err);
    });
    var output = '';
    for (let step =0; step < count; step++) {
        var res = db.serverStatus();
        output = JSON.stringify(res) + "\n";
        fs.writeFile("./serverStatusAll.json", (output), {flag: 'a'}, function(err) {
            if(err) print('error', err);
        });
        sleep(interval);
    }
    print("Continuous collection done.")
}

percona_collector.collectCurrentOp = function(count=1,interval=1000) {
    print("Continuous collection of currentOp metrics in progress...");
    fs.rm("./currentOpAll.json", { force: true }, function(err) {
        if(err) print('error', err);
    });
    var output = '';
    for (let step =0; step < count; step++) {
        var res = db.currentOp();
        output = JSON.stringify(res) + "\n";
        fs.writeFile("./currentOpAll.json", (output), {flag: 'a'}, function(err) {
            if(err) print('error', err);
        });
        sleep(interval);
    }
    print("Continuous collection done.")
}

percona_collector.pbmCollector = function() {
    var pbm_backups = db.getSiblingDB('admin').pbmBackups.find().toArray();
    fs.writeFile("./pbmBackupsCollection.json",  JSON.stringify(pbm_backups), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_agents = db.getSiblingDB('admin').pbmAgents.find().toArray();
    fs.writeFile("./pbmAgentsCollection.json", JSON.stringify(pbm_agents), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_config = db.getSiblingDB('admin').pbmConfig.find().toArray();
    fs.writeFile("./pbmConfigCollection.json", JSON.stringify(pbm_config), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_cmd = db.getSiblingDB('admin').pbmCmd.find().toArray();
    fs.writeFile("./pbmCmdCollection.json", JSON.stringify(pbm_cmd), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_lock = db.getSiblingDB('admin').pbmLock.find().toArray();
    fs.writeFile("./pbmLockCollection.json", JSON.stringify(pbm_lock), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_lockop = db.getSiblingDB('admin').pbmLockOp.find().toArray();
    fs.writeFile("./pbmLockOpCollection.json", JSON.stringify(pbm_lockop), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_log = db.getSiblingDB('admin').pbmLog.find().toArray();
    fs.writeFile("./pbmLogCollection.json", JSON.stringify(pbm_log), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_oplog = db.getSiblingDB('admin').pbmOpLog.find().toArray();
    fs.writeFile("./pbmOpLogCollection.json", JSON.stringify(pbm_oplog), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_pitrchunks = db.getSiblingDB('admin').pbmPITRChunks.find().toArray();
    fs.writeFile("./pbm_PITRChunksCollection.json", JSON.stringify(pbm_pitrchunks), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_pitrstate = db.getSiblingDB('admin').pbmPITRState.find().toArray();
    fs.writeFile("./pbmPITRStateCollection.json", JSON.stringify(pbm_pitrstate), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_status = db.getSiblingDB('admin').pbmStatus.find().toArray();
    fs.writeFile("./pbmStatusCollection.json", JSON.stringify(pbm_status), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
}

percona_collector.hostInfo = function() {
    var output = db.hostInfo();
    fs.writeFile("./hostInfo.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.getServerStatus = function() {
    var output = db.serverStatus();
    fs.writeFile("./serverStatus.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.getCurrentOp = function() {
    var output = db.adminCommand({ currentOp: true });
    fs.writeFile("./currentOp.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.parameterInfo = function() {
    var output = db.adminCommand({ getParameter: '*' });
    fs.writeFile("./getParameter.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.startupOptions = function() {
    var output = db.adminCommand({ getCmdLineOpts: 1 });
    fs.writeFile("./cmdLineOpts.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.replicaSetInfo = function() {
    var output = rs.status();
    fs.writeFile("./rsStatus.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.replicationConfiguration = function() {
    var output = rs.conf();
    fs.writeFile("./rsConf.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.shardInfo = function(bool) {
    var shards = '';
    if (!isMongos()) {
        printjson("not a shard cluster!");
    } else {
        var shards = sh.status(bool);
        fs.writeFile("./shStatus.json", JSON.stringify(shards), {flag: 'w+'}, function(err) {
            if(err) print('error', err);
        });
    }
    return shards;
}

percona_collector.getDbReplicationInfo = function() {
    var output = db.getReplicationInfo();
    fs.writeFile("./getReplicationInfo.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.getRsReplicationInfo = function() {
    var output = rs.printReplicationInfo();
    fs.writeFile("./printReplicationInfo.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.getRsSecondaryReplicationInfo = function() {
    var output = rs.printSecondaryReplicationInfo();
    fs.writeFile("./printSecondaryReplicationInfo.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

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