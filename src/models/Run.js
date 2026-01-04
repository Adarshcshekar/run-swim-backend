const mongoose = require("mongoose");

const RunSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },

  distance: {
    type: Number, // km
    required: true,
  },

  duration: {
    type: Number, // minutes
    required: true,
  },

  calories: {
    type: Number,
  },

  date: {
    type: Date,
    required: true,
  },

  // 👇 IMPORTANT FOR HEALTHKIT
  externalId: {
    type: String, // HealthKit workout id (UUID)
    index: true,
  },

  source: {
    type: String,
    enum: ["manual", "healthkit"],
    default: "manual",
  },
});

module.exports = mongoose.model("Run", RunSchema);
