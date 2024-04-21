const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    description: String,
    question_type: {
      type: String,
      default: "mc",
    },
    options: [
      {
        option_id: Number,
        content: String
      }
    ],
    rightOption: [Number],
    explaination: {
      type: String,
      default: "",
    },
    exam_id: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema, "questions");

module.exports = Question;
