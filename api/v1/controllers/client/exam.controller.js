const Exam = require("../../models/exam.model");
const Question = require("../../models/question.model");
const searchHelper = require("../../../../helpers/search.helper");
const paginationHelper = require("../../../../helpers/pagination.helper");

// [GET] /api/v1/exams
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

// [GET] /api/v1/exams/detail/:id
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
        limitedItem: 5,
      },
      req.query,
      countQuestions
    );

    const questions = await Question.find(find)
      .limit(objectPagination.limitedItem)
      .skip(objectPagination.skip)
      .select("_id description question_type options");
    
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

// [GET] /api/v1/exams/detail/:id/questions
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
        limitedItem: 5,
      },
      req.query,
      countQuestions
    );

    const questions = await Question.find(find)
      .limit(objectPagination.limitedItem)
      .skip(objectPagination.skip)
      .select("_id description question_type options");

    res.json(questions);
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [GET] /api/v1/exams/detail/:id/result
module.exports.result = async (req, res) => {
  const id = req.params.id;

  try {
    const exam = await Exam.findOne({
      _id: id,
      status: "active",
      deleted: false,
    });

    const findQuestions = {
      exam_id: id,
      deleted: false,
    };
    const questions = await Question.find(findQuestions);

    let result = 0;
    let rightAnswer = 0;
    const pointPerQuestion =
      parseFloat(exam.totalPoint) / parseFloat(questions.length);

    const answers = req.body;
    answers.forEach((answer) => {
      const matchingQuestion = questions.find(
        (question) => question.id === answer.question_id
      );

      if (matchingQuestion) {
        // let check = true;

        // for(const option of answer.user_option) {
        //   if(!matchingQuestion.rightOption.includes(option)) {
        //     check = false;
        //     break;
        //   }
        // }

        if(answer.user_option === matchingQuestion.rightOption) {
          result += pointPerQuestion;
          rightAnswer += 1;
        }

        // if (check) {
        //   result += pointPerQuestion;
        //   rightAnswer += 1;
        // }
      }
    });

    const user = req.user;

    const raw_questions = await Question.find(findQuestions).select(
      "question_type description options rightOption explaination"
    );

    const objectResult = {};

    objectResult.exam_id = id;
    objectResult.answers = answers;
    objectResult.result = result;
    objectResult.raw_questions = raw_questions;
    if (exam.type == "unlimited") {
      objectResult.timeDoneExam = Date.now();
    } else {
      objectResult.timeStart = exam.timeStart;
      objectResult.timeFinish = exam.timeFinish;
    }

    user.result.push(objectResult);

    await user
      .save()
      .then(() => console.log("Save successfully!"))
      .catch((error) => console.error("Error: ", error));
    res.json({
      code: 200,
      result: result,
      rightAnswer: rightAnswer,
      totalQuestions: questions.length,
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};
