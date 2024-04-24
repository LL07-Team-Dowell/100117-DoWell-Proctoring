const { Kafka } = require("kafkajs");
const { config, kafka } = require("../config");

async function createTopicByAdmin() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin Connection Success...");

  console.log("Creating Topic [MESSAGE]");
  await admin.createTopics({
    topics: [
      {
        topic: "MESSAGE",
        numPartitions: 2,
      },
    ],
  });
  console.log("Topic Created Success [MESSAGE]");

  console.log("Disconnecting Admin..");
  await admin.disconnect();
}

// Uncomment the following line to execute the function
// createTopicByAdmin();

module.exports = createTopicByAdmin;
