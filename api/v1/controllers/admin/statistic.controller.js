const User = require("../../models/user.model");
const Exam = require("../../models/exam.model");

// [GET] /api/v1/admin/statistic
module.exports.statistic = async (req, res) => {
  try {
    const users = await User.find({ deleted: false });
    const exams = await Exam.find({ deleted: false });
    
    res.json({
      code: 200,
      users: users,
      exams: exams
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};