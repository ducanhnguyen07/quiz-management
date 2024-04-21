const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    if(req.headers.authorization) {
      const tokenUser = req.headers.authorization.split(" ")[1];
  
      const user = await User.findOne({
        tokenUser: tokenUser,
        deleted: false
      });
  
      if(!user) {
        res.json({
          code: 403,
          message: "Permission denied!"
        });
      } else {
        req.user = user;
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