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
    fs.rm("/tmp/pt/collected/serverStatusAll.json", { force: true }, function(err) {
        if(err) print('error', err);
    });
    var output = '';
    for (let step =0; step < count; step++) {
        var res = db.serverStatus();
        output = JSON.stringify(res) + "\n";
        fs.writeFile("/tmp/pt/collected/serverStatusAll.json", (output), {flag: 'a'}, function(err) {
            if(err) print('error', err);
        });
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
        fs.writeFile("/tmp/pt/collected/currentOpAll.json", (output), {flag: 'a'}, function(err) {
            if(err) print('error', err);
        });
        sleep(interval);
    }
    print("Continuous collection done.")
}

percona_collector.pbmCollector = function() {
    var pbm_backups = db.getSiblingDB('admin').pbmBackups.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmBackupsCollection.json",  JSON.stringify(pbm_backups), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_agents = db.getSiblingDB('admin').pbmAgents.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmAgentsCollection.json", JSON.stringify(pbm_agents), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_config = db.getSiblingDB('admin').pbmConfig.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmConfigCollection.json", JSON.stringify(pbm_config), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_cmd = db.getSiblingDB('admin').pbmCmd.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmCmdCollection.json", JSON.stringify(pbm_cmd), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_lock = db.getSiblingDB('admin').pbmLock.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmLockCollection.json", JSON.stringify(pbm_lock), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_lockop = db.getSiblingDB('admin').pbmLockOp.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmLockOpCollection.json", JSON.stringify(pbm_lockop), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_log = db.getSiblingDB('admin').pbmLog.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmLogCollection.json", JSON.stringify(pbm_log), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_oplog = db.getSiblingDB('admin').pbmOpLog.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmOpLogCollection.json", JSON.stringify(pbm_oplog), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_pitrchunks = db.getSiblingDB('admin').pbmPITRChunks.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbm_PITRChunksCollection.json", JSON.stringify(pbm_pitrchunks), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_pitrstate = db.getSiblingDB('admin').pbmPITRState.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmPITRStateCollection.json", JSON.stringify(pbm_pitrstate), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });

    var pbm_status = db.getSiblingDB('admin').pbmStatus.find().toArray();
    fs.writeFile("/tmp/pt/collected/pbmStatusCollection.json", JSON.stringify(pbm_status), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
}

percona_collector.hostInfo = function() {
    var output = db.hostInfo();
    fs.writeFile("/tmp/pt/collected/hostInfo.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.getServerStatus = function() {
    var output = db.serverStatus();
    fs.writeFile("/tmp/pt/collected/serverStatus.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.getCurrentOp = function() {
    var output = db.adminCommand({ currentOp: true });
    fs.writeFile("/tmp/pt/collected/currentOp.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.parameterInfo = function() {
    var output = db.adminCommand({ getParameter: '*' });
    fs.writeFile("/tmp/pt/collected/getParameter.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.startupOptions = function() {
    var output = db.adminCommand({ getCmdLineOpts: 1 });
    fs.writeFile("/tmp/pt/collected/cmdLineOpts.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.replicaSetInfo = function() {
    var output = rs.status();
    fs.writeFile("/tmp/pt/collected/rsStatus.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.replicationConfiguration = function() {
    var output = rs.conf();
    fs.writeFile("/tmp/pt/collected/rsConf.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
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
        fs.writeFile("/tmp/pt/collected/shStatus.json", JSON.stringify(shards), {flag: 'w+'}, function(err) {
            if(err) print('error', err);
        });
    }
    return shards;
}

percona_collector.getDbReplicationInfo = function() {
    var output = db.getReplicationInfo();
    fs.writeFile("/tmp/pt/collected/getReplicationInfo.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.getRsReplicationInfo = function() {
    var output = rs.printReplicationInfo();
    fs.writeFile("/tmp/pt/collected/printReplicationInfo.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
        if(err) print('error', err);
    });
    return output;
}

percona_collector.getRsSecondaryReplicationInfo = function() {
    var output = rs.printSecondaryReplicationInfo();
    fs.writeFile("/tmp/pt/collected/printSecondaryReplicationInfo.json", JSON.stringify(output), {flag: 'w+'}, function(err) {
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
    
    // TODO
    print("Database count: " + dbList.length);
    print("Collection count: " + collCount);
    print("Sharded Collections: " + shardedCollCount);
    print("Unsharded Collections: " + (collCount - shardedCollCount) );
}

percona_collector.collectionStats = function(dbName='',collName='',scaleFactor=1) {
    var mydb = db.getSiblingDB(dbName);
    return mydb.runCommand({ collStats: collName, scale: scaleFactor });
}