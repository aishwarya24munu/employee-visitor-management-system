const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    organization: {
      type: String,
    },

    personToMeet: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    visitDateTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Checked In", "Checked Out"],
      default: "Checked In",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Visitor", visitorSchema);