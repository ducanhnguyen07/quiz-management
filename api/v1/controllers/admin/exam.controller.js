const Course = require("../../models/course.model");
const Exam = require("../../models/exam.model");
const Question = require("../../models/question.model");
const searchHelper = require("../../../../helpers/search.helper");
const paginationHelper = require("../../../../helpers/pagination.helper");

// [GET] /api/v1/admin/exams
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
    const countExams = await Exam.countDocuments(find);
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitedItem: 2,
      },
      req.query,
      countExams
    );
    // End pagination

    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }
    //End Sort

    const exams = await Exam.find(find)
      .sort(sort)
      .limit(objectPagination.limitedItem)
      .skip(objectPagination.skip);

    res.json(exams);
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [GET] /api/v1/admin/exams/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;

  try {
    const record = await Exam.findOne({
      _id: id,
      deleted: false,
    });

    const find = {
      exam_id: id,
      deleted: false,
    };

    // Pagination
    const countQuestions = await Question.countDocuments(find);
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitedItem: 2,
      },
      req.query,
      countQuestions
    );

    const questions = await Question.find(find)
      .limit(objectPagination.limitedItem)
      .skip(objectPagination.skip);

    res.json({
      code: 200,
      record: record,
      questions: questions
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [GET] /api/v1/admin/exams/detail/:id/questions
module.exports.detailQuestions = async (req, res) => {
  const id = req.params.id;

  try {
    const find = {
      exam_id: id,
      deleted: false,
    };

    // Pagination
    const countQuestions = await Question.countDocuments(find);
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitedItem: 2,
      },
      req.query,
      countQuestions
    );

    const questions = await Question.find(find)
      .limit(objectPagination.limitedItem)
      .skip(objectPagination.skip);

    res.json(questions);
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [POST] /api/v1/admin/exams/create
module.exports.create = async (req, res) => {
  const { record, questions } = req.body;

  try {
    const exam = new Exam(record);
    const data = await exam.save();

    const questionPromises = questions.map((question) => {
      question.exam_id = data.id;
      const question_item = new Question(question);
      return question_item.save();
    });

    const question_arr = await Promise.all(questionPromises);

    res.json({
      code: 200,
      exam: data,
      questions: question_arr
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [PATCH] /api/v1/admin/exams/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const { exam, questions } = req.body;

  try {
    const existExam = await Exam.findOne({ _id: id });

    if(!existExam) {
      res.json({
        code: 400
      });
      return;
    }

    // update exam
    await existExam.updateOne({ $set: exam });

    // update questions
    const updatedQuestions = await Promise.all(
      questions.map(async (question) => {
        if (question._id) {
          // exist question
          await Question.findByIdAndUpdate(question._id, question);
          return question;
        } else {
          // new question
          question.exam_id = existExam.id;
          const newQuestion = new Question(question);
          return await newQuestion.save();
        }
      })
    );

    const updateExam = await Exam.findOne({ _id: id });
    const editedQuestions = await Question.find({ exam_id: id });

    res.json({
      code: 200,
      exam: updateExam,
      questions: editedQuestions
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [DELETE] /api/v1/admin/exams/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const exam = await Exam.findOne({ _id: id, deleted: false });

    if(!exam) {
      res.json({
        code: 400,
        message: "Exam not found"
      });
      return;
    }

    await exam.updateOne({ deleted: true, deletedAt: new Date() });

    const questions = await Question.find({ exam_id: id, deleted: false });
    await Promise.all(questions.map(async question => {
      await question.updateOne({ deleted: true, deletedAt: new Date() });
    }));
  
    res.json({
      code: 200
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};
