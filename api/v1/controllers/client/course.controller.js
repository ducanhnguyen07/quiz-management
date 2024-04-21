const Course = require("../../models/course.model");
const Exam = require("../../models/exam.model");
const searchHelper = require("../../../../helpers/search.helper");
const paginationHelper = require("../../../../helpers/pagination.helper");

// [GET] /api/v1/courses
module.exports.index = async (req, res) => {
  try {
    const find = {
      status: "active",
      deleted: false,
    };

    // Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }
    // End search

    // Pagination
    const countCourses = await Course.countDocuments(find);
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitedItem: 2,
      },
      req.query,
      countCourses
    );
    // console.log(objectPagination);

    // End pagination

    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }
    //End Sort

    const courses = await Course.find(find)
      .sort(sort)
      .limit(objectPagination.limitedItem)
      .skip(objectPagination.skip);

    res.json(courses);
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [GET] /api/v1/courses/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Course.find({
      _id: id,
      status: "active",
      deleted: false
    });

    const exams = await Exam.find({
      course_id: id,
      status: "active",
      deleted: false
    });

    res.json({
      record: record,
      exams: exams
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};
