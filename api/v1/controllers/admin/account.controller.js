const md5 = require("md5");

const Account = require("../../models/account.model");

const generateHelper = require("../../../../helpers/generate.helper");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  try {
    const accounts = await Account.find({ deleted: false }).select("-password -token");

    res.json(accounts);
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [POST] /admin/accounts/create
module.exports.create = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
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

    const objectAccount = {
      fullName: req.body.fullName,
      address: req.body.address,
      email: req.body.email,
      password: md5(req.body.password),
      token: generateHelper.generateRandomString(30)
    };

    const record = new Account(objectAccount);
    await record.save();
    
    res.json({
      code: 200,
      newAccount: record
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;

  try {
    const accountUpdate = await Account.findOne({ _id: id, deleted: false });

    if(!accountUpdate) {
      res.json({
        code: 400,
        message: "Account not found!"
      });
      return;
    }

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

    const editedAccount = await Account.findOne({ _id: id, deleted: false }).select("-password -token");

    res.json({
      code: 200,
      editedAccount: editedAccount
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};