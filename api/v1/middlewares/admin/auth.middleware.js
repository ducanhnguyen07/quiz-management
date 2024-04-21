const Account = require("../../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    if(req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
  
      const account = await Account.findOne({
        token: token,
        deleted: false
      });
  
      if(!account) {
        res.json({
          code: 403,
          message: "Permission denied!"
        });
      } else {
        req.account = account;
        next();
      }
    } else {
      res.json({
        code: 403,
        message: "Permission denied!"
      });
    }
  } catch (error) {
    res.json({
      code: 403,
      message: "Permission denied!"
    });
  }
};