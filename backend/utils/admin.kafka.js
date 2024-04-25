const { Kafka } = require("kafkajs");
const { config, kafka } = require("../config/kafka.config");

async function createKafkaTopic(topic) {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin Connected Successfully...");

  console.log(`Creating Topic [${topic}]`);
  await admin.createTopics({
    topics: [
      {
        topic: topic,
        numPartitions: 2,
      },
    ],
  });
  console.log(`Topic [${topic}] Created Successfully `);

  console.log("Disconnecting Admin..");
  await admin.disconnect();
  console.log("Admin Disconnected Successfully...");
}

module.exports = createKafkaTopic;
