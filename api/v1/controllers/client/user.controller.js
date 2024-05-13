const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require('../../models/forgot-password.model');
const generateHelper = require("../../../../helpers/generate.helper");
const sendMailHelper = require("../../../../helpers/sendMail.helper");

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false
    });

    if(existEmail) {
      res.json({
        code: 400,
        message: "Email existed!"
      });
      return;
    }

    const infoUser = {
      fullName: req.body.fullName,
      student_code: req.body.student_code,
      student_class: req.body.student_class,
      dob: req.body.dob,
      address: req.body.address,
      email: req.body.email,
      password: md5(req.body.password),
      tokenUser: generateHelper.generateRandomString(30)
    };

    const user = new User(infoUser);
    const data = await user.save();
    
    // console.log(data);
    const tokenUser = data.tokenUser;
    res.cookie("tokenUser", tokenUser);
  
    res.json({
      code: 200,
      message: "Creat account successfully!",
      data: data,
      tokenUser: tokenUser
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      email: email,
      deleted: false
    });

    if(!user) {
      res.json({
        code: 400,
        message: "Email not exist!"
      });
      return;
    }

    if(md5(password) !== user.password) {
      res.json({
        code: 400,
        message: "Wrong password!"
      });
      return;
    }

    const tokenUser = user.tokenUser;
    res.cookie("tokenUser", tokenUser);

    res.json({
      code: 200,
      message: "Log in successfully!",
      tokenUser: tokenUser
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({
      email: email,
      deleted: false
    });

    if(!user) {
      res.json({
        code: 400,
        message: "Email not exist!"
      });
      return;
    }

    const otp = generateHelper.generateRandomNumber(6);

    const timeExpire = 3;

    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire*60*1000
    };

    // console.log(objectForgotPassword);

    // save to db
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // send OTP code through email
    const subject = "Mã OTP xác minh đặt lại mật khẩu Quiz Management";
    const content = `
      Mã OTP để đặt lại mật khẩu của bạn là <b>${otp}</b>(Sử dụng trong ${timeExpire} phút).
      Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
    `;

    sendMailHelper.sendMail(email, subject, content);

    res.json({
      code: 200,
      message: "OTP sent"
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  try {
    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp
    });

    if(!result) {
      res.json({
        code: 400,
        message: "OTP invalid!"
      });
      return;
    }

    const user = await User.findOne({ email: email });
    res.cookie("tokenUser", user.tokenUser);

    res.json({
      code: 200,
      tokenUser: user.tokenUser
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  const tokenUser = req.body.tokenUser;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      tokenUser: tokenUser,
      deleted: false
    });
    if(!user) {
      res.json({
        code: 400,
        message: "User not exist!"
      });
      return;
    }

    if(md5(password) == user.password) {
      res.json({
        code: 400,
        message: "This is old password!"
      });
      return;
    }

    await User.updateOne({ tokenUser: tokenUser }, { password: md5(password) });

    res.json({
      code: 200,
      message: "Change password successfully!"
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
  try {
    const user = {
      fullName: req.user.fullName,
      student_code: req.user.student_code,
      student_class: req.user.student_class,
      dob: req.user.dob,
      address: req.user.address,
      email: req.user.email,
      result: req.user.result
    };
    res.json({
      code: 200,
      user: user
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

module.exports.validateAuth = async (req, res, next) => {
  try {
    if(req.headers.authorization) {
      const tokenUser = req.headers.authorization.split(" ")[1];
      
      const user = await User.findOne({
        tokenUser: tokenUser,
        deleted: false
      });
  
      if(!user) {
        res.json({
          code: 400
        });
        return;
      }
      res.json({
        code: 200,
        message: "Accepted"
      });
    } else {
      res.json({
        code: 400
      });
    }
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

module.exports.result = async (req, res, next) => {
  try {
    const user = req.user;
    const result = user.result;
    res.json({
      code: 200,
      result: result
    });
  } catch (error) {
    res.json({
      code:400
    });
  }
};