const validateEmail = (email) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(email);
};

module.exports.register = (req, res, next) => {
  if(!req.body.fullName || req.body.fullName.length == 0){
    res.json({
      code: 400,
      message: "Full name is required!"
    });
    return;
  }

  if(!req.body.student_code || req.body.student_code.length == 0){
    res.json({
      code: 400,
      message: "Student code is required!"
    });
    return;
  }

  if(!req.body.student_class || req.body.student_class.length == 0){
    res.json({
      code: 400,
      message: "Student class is required!"
    });
    return;
  }

  if(!req.body.dob || req.body.dob.length == 0){
    res.json({
      code: 400,
      message: "Date of birth is required!"
    });
    return;
  }

  if(!req.body.address || req.body.address.length == 0){
    res.json({
      code: 400,
      message: "Address is required!"
    });
    return;
  }

  if(!req.body.email || req.body.email.length == 0){
    res.json({
      code: 400,
      message: "Email is required!"
    });
    return;
  }

  if (!validateEmail(req.body.email)) {
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

module.exports.login = (req, res, next) => {
  if(!req.body.email){
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

module.exports.forgotPassword = (req, res, next) => {
  if(!req.body.email){
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

  next();
};

module.exports.otpPassword = (req, res, next) => {
  if(!req.body.email){
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

  next();
};

module.exports.resetPassword = (req, res, next) => {
  if(!req.body.password){
    res.json({
      code: 400,
      message: "Password is required!"
    });
    return;
  }

  next();
};