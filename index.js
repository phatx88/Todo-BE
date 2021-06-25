const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser")

dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Succesfully connected to database");
        }
    }
);

app.use("/api",require("./routes/mainRoutes") );

app.listen(PORT, () => console.log("Server is running"))

module.exports = app