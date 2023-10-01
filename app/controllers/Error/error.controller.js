const Error = require("../../models/Error/error.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const error = new Error({
    user_id: req.body.user_id,
    code: req.body.code,
    title: req.body.title,
    solution:req.body.solution
  });

  Error.create(error, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    else res.send(data);
  });
};

exports.findAll = (req, res) => {

  Error.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    else res.send(data);
  });
};

exports.findError = (req, res) => {

  Error.getOne(req.params.id,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    else res.send(data);
  });
};


exports.findUser = (req, res) => {
  Error.findUser(req.params.id, (err, data) => {
    if (err) {
      if (err.kind=== "not_found") {
        res.status(404).send({
          message: `Not found Tutorial with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving share with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

exports.findUpdate = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  Error.findUpdate(req.body.error_id,req.body.code,req.body.title,req.body,req.body.solution, (err, data) => {
    if (err) {
      if (err.kind=== "not_found") {
        res.status(404).send({
          message: `Not found error with id ${req.body.error_id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving error with id " + req.body.error_id
        });
      }
    } else res.send(data);
  });
};

