const validateEmail = (email) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(email);
};

module.exports.login = (req, res, next) => {
  if(!req.body.email || req.body.email.length == 0){
    res.json({
      code: 400,
      message: "Email is required!"
    });
    return;
  }

  if(!validateEmail(req.body.email)) {
    res.json({
      code: 400,
      message: "Invalid email format!"
    });
    return;
  }

  if(!req.body.password){
    res.json({
      code: 400,
      message: "Password is required!"
    });
    return;
  }

  next();
};

