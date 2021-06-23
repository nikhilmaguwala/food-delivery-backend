const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to Food App API"});
});

// set up routes to listen
require("./routes/restaurant.routes")(app);
require("./routes/dish.routes")(app);
require("./routes/user.routes")(app);
require("./routes/partner.routes")(app);
require("./routes/category.routes")(app);
require("./routes/order.routes")(app);
require("./routes/address.routes")(app);
require("./routes/db.routes")(app);
require("./routes/favourite.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
