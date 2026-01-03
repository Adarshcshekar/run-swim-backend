const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Swim",
  new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    distance: Number,
    duration: Number,
    laps: Number,
    date: Date,
  })
);
