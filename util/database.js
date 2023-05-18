const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const MongoConnect = (callback) => {
    MongoClient.connect(
        "mongodb+srv://saubanh05062001:M08oZmpbODNHVGwv@shopee.k0dhqh5.mongodb.net/?retryWrites=true&w=majority"
    )
        .then((client) => {
            console.log("Connected!");
            callback(client);
        })
        .catch((err) => console.log(err));
};

module.exports = MongoConnect;
