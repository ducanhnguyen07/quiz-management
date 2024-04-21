const md5 = require("md5");

const searchHelper = require("../../../../helpers/search.helper");
const paginationHelper = require("../../../../helpers/pagination.helper");
const generateHelper = require("../../../../helpers/generate.helper");

const User = require("../../models/user.model");

// [GET] /api/v1/admin/users
module.exports.index = async (req, res) => {
  try {
    const find = {
      deleted: false
    };

    // Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }
    // End search

    // Pagination
    const countUsers = await User.countDocuments(find);
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitedItem: 2,
      },
      req.query,
      countUsers
    );
    // End pagination

    // Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }
    //End Sort

    const users = await User.find(find)
      .sort(sort)
      .limit(objectPagination.limitedItem)
      .skip(objectPagination.skip)
      .select("-password -tokenUser -result");

    res.json(users);
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

// [POST] /api/v1/admin/users/create
module.exports.create = async (req, res) => {
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

    // console.log(req.body);

    const user = new User(infoUser);
    await user.save();
  
    res.json({
      code: 200,
      message: "Creat account successfully!",
      user: user
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [PATCH] /api/v1/admin/users/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;

  try {
    const userUpdate = await User.findOne({ _id: id, deleted: false });

    if(!userUpdate) {
      res.json({
        code: 400,
        message: "User not found!"
      });
      return;
    }

    const emailExist = await User.findOne({
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
    
    await User.updateOne({ _id: id }, req.body);

    res.json({
      code: 200
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [GET] /api/v1/admin/users/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({ _id: id, deleted: false });

    if(!user) {
      res.json({
        code: 400,
        message: "User not found"
      });
      return;
    }

    res.json(user);
  } catch (error) {
    res.json({
      code: 400
    });
  }
};

// [DELETE] /api/v1/admin/users/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    await User.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );

    res.json({
      code: 200
    });
  } catch (error) {
    res.json({
      code: 400
    });
  }
};