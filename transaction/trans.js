const mongoose = require("mongoose");
const currency = require("currency.js");
const initDatabase = require("../initialize/initDB");
const Client = require("../module/client");
const TransJournal = require("../module/transJournal");

async function transaction(senderAccountNumber, receiverAccountNumber, amount) {
  await initDatabase();

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sender = await Client.findOne({
      accountNumber: senderAccountNumber,
    }).session(session);
    if (!sender) throw new Error("Sender not found");
    sender.balance = currency(sender.balance).subtract(amount);

    if (sender.balance < amount)
      throw new Error(`${sender.name} has insufficient funds`);
    await sender.save();

    const debitJournal = new TransJournal({
      accountNumber: senderAccountNumber,
      operation: "Debit",
      amount: amount,
    });
    await debitJournal.save();


    const receiver = await Client.findOne({
      accountNumber: receiverAccountNumber,
    }).session(session);
    if(!receiver) throw new Error("Receiver not found");
    receiver.balance = currency(receiver.balance).add(amount);
    await receiver.save();

    const creditJournal = new TransJournal({
        accountNumber: receiverAccountNumber,
        operation: "credit",
        amount: amount
    });
    await creditJournal.save();

    await session.commitTransaction();
        console.log("Transfer has been completed successfully!");
  } catch(error){
    await session.abortTransaction();
    console.log(error);
    throw error;
  }finally{
       session.endSession();
  }
}

module.exports = transaction;