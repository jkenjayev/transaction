const mongoose = require("mongoose");
const Client = require("../module/client");

const connString = "mongodb://localhost:27017/transactions";
async function initDatabase() {
  await mongoose.connect(connString, {
    replicaSet: "rs",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const senderAccountNumber = "AB123456789";
  const receiverAccountNumber = "ZD987654321";

  const sender = await Client.findOne({ accountNumber: senderAccountNumber });
  if (!sender) {
    const sender = new Client({
      name: "Client_1",
      accountNumber: senderAccountNumber,
      balance: 98000.0,
    });

    const result = sender.save();
  }

  const receiver = await Client.findOne({
    accountNumber: receiverAccountNumber,
  });
  if (!receiver) {
    const receiver = new Client({
      name: "Client_2",
      accountNumber: receiverAccountNumber,
      balance: 34000.0,
    });

    const result = await receiver.save();
  }
}


module.exports = initDatabase;