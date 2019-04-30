const MongoClient = require('mongodb').MongoClient;
const request = require('request');

const connectionString = process.env.mongoDbConnection;
const dbName = 'ultimatettt-analytics';
const collectionName = 'gameData';

const setBadRequest = (context, message) => {
    context.log.info(message);
    context.res = {
        status: 400,
        body: message
    };
    context.done();
};

const sendPushNotification = (numberOfMoves, winner) => {
    const baseUrl = process.env.baseUrl;
    const environment = process.env.environment;
    request.post(`${baseUrl}?value1=${numberOfMoves}&value2=${winner}&value3=${environment}`);
};

module.exports = function (context, req) {
    const date = new Date(Date.now()).toISOString();
    const game = req.body.gameState;
    const winner = req.body.winner;
    const moves = req.body.moves;

    if(game === undefined || game === null || !Array.isArray(game) || game.length === 0) {
        setBadRequest(context, "property game should be defined and be an array with elements");
        return;
    }

    if(moves === undefined || moves === null || !Array.isArray(moves || moves.length === 0)) {
        setBadRequest(context, "property moves should be defined and be an array with elements");
        return;
    }

    if(winner === undefined || (typeof winner !== 'string' && winner !== null) ||
        (winner !== "O" && winner !== "X" && winner !== null)) {
        setBadRequest(context,
            "property winner should be defined, be a string and only have the value X, O or null");
        return;
    }
    
    const gameObject = {
        date,
        winner,
        gameState: game,
        moves,
    };
    
    sendPushNotification(moves.length, winner);
    
    MongoClient.connect(connectionString, function(err, client) {
        if(err) {
            context.log.error(err);
            context.res = {
                status: 500,
                body: "there was an error while connecting to the database"
            };
            context.done();
            return;
        }

        context.log.info("Connected successfully to server");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        collection.insertOne(gameObject, function(err, result) {
            if(err) {
                context.log.error(err);
                context.res = {
                    status: 500,
                    body: "there was an error while inserting the gameData"
                };
                context.done();
            } else {
                context.log.info("Inserted 1 document into the collection");
                context.res = { 
                    headers: { 'Content-Type': 'application/json' },
                    body: gameObject._id
                };
                client.close();
                context.done();
            }
        });
    });
};
