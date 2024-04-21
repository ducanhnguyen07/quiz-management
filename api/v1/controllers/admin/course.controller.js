const Course = require("../../models/course.model");
const Exam = require("../../models/exam.model");
const searchHelper = require("../../../../helpers/search.helper");
const paginationHelper = require("../../../../helpers/pagination.helper");

// [GET] /api/v1/admin/courses
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

// [GET] /api/v1/admin/courses/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Course.findOne({
      _id: id,
      status: "active",
      deleted: false,
    });

    const exams = await Exam.find({
      course_id: id,
      status: "active",
      deleted: false,
    });

    res.json({
      record: record,
      exams: exams,
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [PATCH] /api/v1/admin/courses/change-status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;

  try {
    await Course.updateOne(
      { _id: id },
      { status: req.body.status }
    );

    const updatedCourse = await Course.findOne({ _id: id });

    res.json({
      code: 200,
      updatedCourse: updatedCourse
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [PATCH] /api/v1/admin/courses/change-multi
module.exports.changeMulti = async (req, res) => {
  const { ids, key, value } = req.body;

  try {
    switch (key) {
      case "status":
        await Course.updateMany(
          { _id: { $in: ids }},
          { status: value }
        );

        const updatedCourses = await Course.find({ _id: { $in: ids } });

        res.json({
          code: 200,
          message: "Change status successfully!",
          updatedCourses: updatedCourses
        });
        break;

      case "delete":
        await Course.updateMany(
          { _id: { $in: ids }},
          {
            deleted: true,
            deletedAt: new Date()
          }
        );

        const deletedCourses = await Course.find({ _id: { $in: ids } }).select("deleted");

        res.json({
          code: 200,
          message: "Delete successfully!",
          deletedCourses: deletedCourses
        });
        break;

      default:
        res.json({
          code: 400,
          message: "Not in change multi cases!"
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Failed!"
    });
  } 
};

// [POST] /api/v1/admin/courses/create
module.exports.create = async (req, res) => {
  try {
    const course = new Course(req.body);
    const data = await course.save();

    res.json({
      code: 200,
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [PATCH] /api/v1/admin/courses/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;

  try {
    await Course.updateOne({ _id: id }, req.body);

    const updateCourse = await Course.findOne({ _id: id });

    res.json({
      code: 200,
      updateCourse: updateCourse
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [DELETE] /api/v1/admin/courses/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    await Course.updateOne(
      { _id: id },
      { deleted: false, deletedAt: new Date() }
    );

    res.json({
      code: 200
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};
