const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

require("dotenv").config();

const app = express();
const port = process.env.PORT;

const database = require("./config/database");

const routesVer1Client = require("./api/v1/routes/client/index.route");
const routesVer1Admin = require("./api/v1/routes/admin/index.route");

database.connect();

// var corsOptions = {
//   origin: 'http://example.com',
// }
// app.use(cors(corsOptions))

app.use(cors());

// parse application/json
app.use(bodyParser.json());

// Router Ver1 client
routesVer1Client(app);

// Router Ver1 admin
routesVer1Admin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});