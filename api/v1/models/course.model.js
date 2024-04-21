const mongoose = require('mongoose');

const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    credits: Number,
    lecturer: String,
    department: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    slug: { 
      type: String,
      slug: "title",
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema, "courses");

module.exports = Course;