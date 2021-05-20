require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();
const doctor = require("./routes/doctor");
const auth = require("./routes/auth");
//const patient = require("./routes/patient")


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  /*  res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, 
    Accept, x-client-key, x-client-token, x-client-secret, Authorization");*/
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *");
    if (req.method === "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "GET, PUT, POST, PATCH, DELETE, OPTIONS"
        );
        res.setHeader("Access-Control-Allow-Credentials", true);
        return res.status(200).json({});
    }
    next();
});


app.use("/doctor",doctor);
app.use("/auth",auth);
//app.use("/patient",patient);

app.use("/assets/uploads", express.static(__dirname + "/assets/uploads"));


app.get("/", (req, res) => {
    res.status(200).json({
        message: "hellooo!!!",
        url: `${req.protocol}://${req.get("host")}`,
    });
});

mongoose.connect(
         //"mongodb://localhost:27017/healthShift",
        "mongodb+srv://Shubham:Shubh@health@19@cluster0.wyyca.mongodb.net/healthShiftDB?retryWrites=true&w=majority",
        /*"mongodb+srv://balu:mongopassword@cluster0.6ujrr.mongodb.net/example?retryWrites=true&w=majority",*/ { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log("DB Connected!!!")
        app.listen(process.env.PORT || 7000, () =>
            console.log("Server started!!!")
        )
    })
    .catch((err) => {
        console.log(err);
    });


