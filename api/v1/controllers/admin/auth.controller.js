const md5 = require("md5");

const Account = require("../../models/account.model");

// [POST] /api/v1/admin/auth/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const account = await Account.findOne({
      email: email,
      deleted: false
    });
  
    if(!account){
      res.json({
        code: 400,
        message: "Email not exist!"
      });
      return;
    }
  
    if(md5(password) != account.password) {
      res.json({
        code: 400,
        message: "Wrong password!"
      });
      return;
    }
  
    const token = account.token;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Log in successfully!",
      token: token
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};