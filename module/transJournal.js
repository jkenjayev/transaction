const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    accountNumber: String,
    operation: String,
    amount: Number 
});

const TransJournal = mongoose.model("TransJournal", schema);

module.exports = TransJournal;