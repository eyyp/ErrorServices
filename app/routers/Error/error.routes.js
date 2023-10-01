const authorize = require('../../middleware/authorize/authorize');
module.exports = app => {
    const error = require("../../controllers/Error/error.controller.js");
  
    var router = require("express").Router();
  
    router.post("/create", error.create);
  
    router.get("/all", error.findAll);

    router.post("/update", error.findUpdate);

    router.get("/user/:id", error.findUser);

    router.get("/find/:id", error.findError);
  
    app.use('/api/error', authorize.authorize, router);
};