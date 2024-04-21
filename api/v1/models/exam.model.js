const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    type: {
      type: String,
      default: "unlimited",
    },
    time: Number,
    totalPoint: Number,
    timeStart: Date,
    timeFinish: Date,
    course_id: String,
    status: String,
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

const Exam = mongoose.model("Exam", examSchema, "exams");

module.exports = Exam;