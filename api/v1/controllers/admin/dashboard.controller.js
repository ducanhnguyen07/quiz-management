const Course = require("../../models/course.model");
const Exam = require("../../models/exam.model");
const User = require("../../models/user.model");

// [GET] /api/v1/admin/dashboard
module.exports.dashboard = async (req, res) => {
  try {
    const users = await User.find({ deleted: false });

    const exams = await Exam.find({ deleted: false });

    const examsArray = [];

    for(let i=0; i<exams.length; i++){
      const objectExam = {};
      objectExam.exam_id = exams[i].id;
      objectExam.exam_title = exams[i].title;
      objectExam.fullName = [];

      let avgPoint = 0;

      for(let j=0; j<users.length; j++) {
        if(users[j].result.length > 0) {
          const result = users[j].result;
          let userAvgPoint = 0;

          for(let k=0; k<result.length; k++) {
            if(result[k].exam_id == exams[i].id){
              if(!objectExam.fullName.includes(users[j].fullName)) {
                objectExam.fullName.push(users[j].fullName);
              }
              userAvgPoint += result[k].result;
            }
          }

          userAvgPoint /= result.length;
          avgPoint += userAvgPoint;
        }
      }

      objectExam.countUser = objectExam.fullName.length;
      objectExam.completePercent = objectExam.countUser/users.length;
      objectExam.avgPoint = avgPoint/objectExam.countUser;
      objectExam.totalPoint = exams[i].totalPoint;

      examsArray.push(objectExam);
    }
      
    res.json({
      code: 200,
      examsArray: examsArray
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};