const sql = require("../db.js");

const { 
    v4: uuidv4,
} = require('uuid');

const User = function(user) {
    this.user_id = uuidv4();
    this.create_date = new Date();
    this.nick = user.nick;
    this.password = user.password;
    this.avatar = user.avatar;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, {...newUser });
  });
};

User.findOne = (nick,password,result) => {
  let query = `SELECT * FROM users WHERE nick="${nick}" and password="${password}" `;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if(res.length > 0){
      result(null, res);
    }
     else{
      result(null,{status:'dont'})
     }
  });
};

User.find= (id,result) => {
  let query = `SELECT avatar,nick,user_id FROM users WHERE user_id="${id}" `;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

User.data = (id,result) => {
  let query = `SELECT * FROM users WHERE user_id="${id}"`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

User.search = (result) => {
    let query = `SELECT user_id,nick,avatar FROM users`;
  
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      result(null, res);
    });
};

User.nickCheck = (nick,result) => {
  let query = `SELECT nick FROM users WHERE nick = "${nick}" `;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if(res.length > 0){
      result(null, {status:"true"});
    }
    else{
      result(null, {status:"false"});
    }
  });
};

User.updateNick = (user_id, newNick, result) => {
    sql.query(
      "UPDATE users SET nick = ? WHERE user_id = ?",
      [newNick,user_id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          result({ kind: "not_found" }, null);
          return;
        }
  
        result(null, { user_id: user_id});
      }
    );
};

User.updatePassword = (user_id, new_password, result) => {
    sql.query(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [new_password,user_id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Tutorial with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        result(null, { user_id: user_id});
      }
    );
};
User.getAll = (result) => {
  sql.query(`SELECT * FROM users`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};
module.exports = User;