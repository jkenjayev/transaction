const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: String,
    accountNumber: String,
    balance: Number
});

const Client = mongoose.model("Client", schema);

module.exports = Client;
