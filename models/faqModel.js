const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    translations: {
      type: Map,
      of: new mongoose.Schema({
        question: { type: String },
        answer: { type: String },
      }),
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faq", FaqSchema);
