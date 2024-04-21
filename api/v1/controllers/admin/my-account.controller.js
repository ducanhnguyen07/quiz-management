const Account = require("../../models/account.model");
const md5 = require('md5');

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.json({
    code: 200,
    account: req.account
  });
};

// [PATCH] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  const id = req.account.id;
  
  try {
    const emailExist = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false
    });
  
    if(emailExist) {
      res.json({
        code: 400,
        message: "Email existed!"
      });
      return;
    }
    
    if(req.body.password && req.body.password.length > 0){
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    
    await Account.updateOne({ _id: id }, req.body);

    res.json({
      code: 200
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};