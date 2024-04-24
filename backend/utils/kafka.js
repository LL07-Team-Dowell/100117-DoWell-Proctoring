const { kafka } = require("../config");
const { addMessage } = require('./controller/messageController');

let producer = null;

async function createProducer() {
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
        const producer = await createProducer();
        const messageValue = JSON.stringify(data);
        await producer.send({
            topic: topic,
            messages: [{ value: messageValue }],
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
                    addMessage(JSON.parse(message.value.toString()));
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
