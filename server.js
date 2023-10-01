const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require("cors");

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

app.use(express.json()); 

app.use(express.urlencoded({ extended: true })); 

require("./app/routers/Error/error.routes.js")(app);
require("./app/routers/User/user.routes.js")(app);

const port = 8080;
http.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor`);
});

