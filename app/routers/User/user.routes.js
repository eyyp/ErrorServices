const authorize = require('../../middleware/authorize/authorize');
module.exports = app => {
    const user = require("../../controllers/User/user.controller.js");
  
    var router = require("express").Router();

    router.post("/create", user.create);
  
    router.post("/check", user.findOne);

    router.post("/token", user.token);

    router.post("/change/nick",user.updateNick);

    router.post("/change/password",user.updatePassword);

    app.use('/api/user', router);
};