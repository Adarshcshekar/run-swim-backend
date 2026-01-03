const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Run",
  new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    distance: Number,
    duration: Number,
    calories: Number,
    date: Date,
  })
);
