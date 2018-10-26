const MongoClient = require('mongodb').MongoClient;

const connectionString = process.env.mongoDbConnection;
const dbName = 'ultimatettt-analytics';
const collectionName = 'gameData';

returnBadRequest = (context, message) => {
    context.log.info(message);
    context.res = {
        status: 400,
        body: message
    };
    context.done();
}

module.exports = function (context, req) {
    const date = new Date(Date.now()).toISOString();
    const isReplay = req.body.isReplay;
    const gameState = req.body.gameState;
    const winner = req.body.winner;
    const moves = req.body.moves;

    if(isReplay === undefined || isReplay === null || typeof isReplay !== 'boolean') {
        returnBadRequest(context, "property isReplay should be defined and be a boolean");
    }

    if(gameState === undefined || gameState === null || !Array.isArray(gameState) || gameState.length === 0) {
        returnBadRequest(context, "property gameState should be defined and be an array with elements");
    }

    if(moves === undefined || moves === null || !Array.isArray(moves || moves.length === 0)) {
        returnBadRequest(context, "property moves should be defined and be an array with elements");
    }

    if(winner === undefined || (typeof winner !== 'string' && winner !== null) || 
        (winner !== "Y" && winner !== "X" && winner !== null)) {
        returnBadRequest(context,
            "property winner should be defined, be a string and only have the value X, Y or null");
    }

    const gameObject = {
        date,
        isReplay,
        gameState,
        moves,
        winner
    };

    MongoClient.connect(connectionString, function(err, client) {
        if(err) {
            context.log.error(err);
            context.res = {
                status: 500,
                body: "there was an error while connecting to the database"
            };
        }

        context.log.info("Connected successfully to server");

        const db = client.db(dbName);

        const collection = db.collection(collectionName);
        collection.insertOne(gameObject, function(err, result) {
            if(err) {
                context.log.error(err);
            }
            context.log.info("Inserted 1 document into the collection");
        });

        client.close();
        context.done();
    });
};