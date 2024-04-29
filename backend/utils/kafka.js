const { kafka } = require("../config/kafka.config");
const { addmessage } = require('../controller/messageController');

let producer = null;

async function initProducer() {
    if (producer) return producer;

    const _producer = kafka.producer();
    try {
        await _producer.connect();
        producer = _producer;
        console.log("Producer connected successfully.");
        return producer;
    } catch (error) {
        console.error("Error connecting to Kafka producer:", error);
        throw error;
    }
}

async function Producer(topic,data) {
    try {
        const producer = await initProducer();
        const dataValue = JSON.stringify(data);
        await producer.send({
            topic: topic,
            messages: [{ value: dataValue }],
        });
        console.log(`${topic} produced successfully.`);
        return true;
    } catch (error) {
        console.error(`Error producing the topic ${topic}: `, error);
        return false;
    }
}

async function Consumer(topic) {
    try {
        console.log("Consumer is running..");
        const consumer = kafka.consumer({ groupId: "default" });
        await consumer.connect();
        await consumer.subscribe({ topic: topic, fromBeginning: true });

        await consumer.run({
            autoCommit: true,
            eachMessage: async ({ message, pause }) => {
                if (!message.value) return;
                console.log(`New message received..`);
                try {
                    addmessage(JSON.parse(message.value.toString()));
                } catch (err) {
                    console.error(`Error processing ${topic}: `, err);
                    pause();
                    setTimeout(() => {
                        consumer.resume([{ topic: topic }]);
                    }, 60 * 1000);
                }
            },
        });
    } catch (error) {
        console.error(`Error starting ${topic} consumer:`, error);
    }
}

module.exports = { Producer, Consumer };
