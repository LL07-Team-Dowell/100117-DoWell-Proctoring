const { Kafka } = require("kafkajs");

require('dotenv').config();

module.exports.config = {
    PORT: process.env.PORT || 8005,
    IP: process.env.IP || process.env.IPDEV,
    MONGO_DB_URI: process.env.MONGO_DB_URI || process.env.MONGO_DB_URI_DEV
};

module.exports.kafka = new Kafka({
    clientId: "proctoring",
    brokers: [process.env.IP]
}); 
