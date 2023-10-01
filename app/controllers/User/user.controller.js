const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../../enviroments/enviroment');

let refreshTokens = [];
const User = require("../../models/User/user.model.js");

exports.create = (req, res) => {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    const user = new User({
      nick: req.body.nick,
      password: req.body.password,
      avatar:req.body.avatar,
    });
  
    User.create(user, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user."
        });
      else res.send(data);
    });
};

exports.findOne = (req, res) => {
  User.findOne(req.body.nick,req.body.password,(err, data) => {
    if (err) {
      if (err.kind=== "not_found") {
        res.status(404).send({
          message: `User not found.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id"
        });
      }
    } else {
        const access_token = generateAccessToken(data[0]);
        const refresh_token = generateRefreshToken(data[0]);
        refreshTokens.push(refresh_token);
        res.send({...data[0],access_token,refresh_token})
    };
  });
};

exports.find = (req, res) => {
  User.find(req.params.id,(err, data) => {
    if (err) {
      if (err.kind=== "not_found") {
        res.status(404).send({
          message: `User not found.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving share with id "
        });
      }
    } else {
        res.send({...data[0]})
    };
  });
};

exports.data = (req, res) => {
  User.data(req.params.id,(err, data) => {
    if (err) {
      if (err.kind=== "not_found") {
        res.status(404).send({
          message: `User not found.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving share with id "
        });
      }
    } else {
        res.send(data)
    };
  });
};

exports.search = (req, res) => {
  User.search((err, data) => {
    if (err) {
      if (err.kind=== "not_found") {
        res.status(404).send({
          message: `Not found Tutorial with id .`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving share with id " 
        });
      }
    } else res.send(data);
  });
};
exports.findAll = (req, res) => {

  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    else res.send(data);
  });
};
exports.nickCheck = (req, res) => {
  User.nickCheck(req.params.nick,(err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found nick.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving share with id " 
        });
      }
    } else res.send(data);
  });
};

exports.updateNick = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  User.updateNick( req.body.user_id, req.body.nick,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Tutorial with id.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Tutorial with id"
          });
        }
      } else res.send(data);
    }
  );
};

exports.updatePassword = (req, res) => {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    User.updatePassword( req.body.user_id, req.body.password,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Tutorial with id.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Tutorial with id"
            });
          }
        } else res.send(data);
      }
    );
  };

  exports.token = (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken === null) {
        return res.status(401).send('refresh token null');
    }
    else {
        if(!refreshTokens.includes(refreshToken)){
          return res.status(401).send('UNAUTHORIZE');
        }
        else{
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
                if (err){
                  return res.sendStatus(401)
                }
                const accessToken = generateAccessToken({ name: user.name })
                res.json({ access_token: accessToken })
            })
        }
    }
  }

exports.logout = (req, res) => {
    const {token} = req.params;
    refreshTokens = refreshTokens.filter(token => token !== token);
    res.status(204).send();
}

const generateAccessToken = (user) => {
    const time = 1000 * 60 * 60;
    const s = time.toString();
    return jwt.sign({user}, ACCESS_TOKEN_SECRET, { expiresIn: time});
}

const generateRefreshToken = (user) => {
  return jwt.sign({user}, REFRESH_TOKEN_SECRET);
}
