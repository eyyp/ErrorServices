const sql = require("../db.js");
const { 
    v4: uuidv4,
  } = require('uuid');

const Error = function(error) {
    this.error_id = uuidv4();
    this.create_date = new Date();
    this.code = error.code;
    this.title = error.title;
    this.solution = error.solution;
    this.user_id = error.user_id;
};

Error.create = (newError, result) => {
  sql.query("INSERT INTO error SET ?", newError, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, {...newError });
  });
};

Error.getOne = (error_id,result) => {
  sql.query(`SELECT * FROM error error_id="${error_id}"`, (err, resError) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null,resError);
  });
};

Error.findUser = (user_id,result) => {
  sql.query(`SELECT * FROM error WHERE user_id = "${user_id}"`, (err, resError) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if(resError.length > 0){
          sql.query("SELECT avatar,nick,user_id FROM users ", (err, resUser) => {
            var response = [];
            resError.map((item,index)=>{
              var users = resUser.filter((element)=>{
                return element.user_id == item.user_id
              })
              response[index] = {error:item};
              response[index] = {...response[index],user:users[0]};
            });
            result(null,response)
          });
    }
    else{
      result(null,[])
    }
  });
};

Error.findUpdate = (error_id,code,title,solution, result) => {
  sql.query(
    "UPDATE error SET code=?,title=?,solution=? WHERE error_id=?",
    [code,title,solution,error_id],
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

      result(null, { error_id: error_id});
    }
  );
};

Error.getAll = (result) => {
  sql.query(`SELECT * FROM error`, (err, resError) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if(resError.length > 0){
          sql.query("SELECT avatar,nick,user_id FROM users ", (err, resUser) => {
            var response = [];
            resError.map((item,index)=>{
              var users = resUser.filter((element)=>{
                return element.user_id == item.user_id
              })
              response[index] = {error:item};
              response[index] = {...response[index],user:users[0]};
            });
            result(null,response)
          });
    }
    else{
      result(null,[])
    }
  });
};
module.exports = Error;