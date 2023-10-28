const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const app = express();
const axios = require("axios");
/*zviyfishpkucdaqpck@awdrt.org may@dodihome.com*/
console.log("....kuate");
/*if (process.env.NODE_ENV !== "production") {
  require("dotenv/config");
} else {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}*/
app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
const mongodburi =
  process.env.MONGODB_URI ||
  "mongodb+srv://oltofbmcelriqlkhue:8meAS5s3URshv3ru@cluster.phcozaq.mongodb.net/?retryWrites=true&w=majority";
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/profile", require("./routers/profileRoute"));
app.use("/api/job", require("./routers/jobRoute"));
app.use(passport.initialize());
require("./passport")(passport);
app.get("/", (req, res) => {
  res.json({
    message: `Welcome To Our 
        Application`,
  });
});
/*app.post("/api/location", (req, res) => {
  //  res.json({ country_name: "abnanan" });
  axios
    .get("https://ipapi.co/json/")
    .then((res) => {
      console.log(res.data);
      res.json(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});*/
app.get("/api/location", (req, res) => {
  var https = require("https");

  const options = {
    path: "/json/",
    host: "ipapi.co",
    port: 443,
    headers: { "User-Agent": "nodejs-ipapi-v1.02" },
  };
  https.get(options, function (resp) {
    var body = "";
    resp.on("data", function (data) {
      body += data;
    });

    resp.on("end", function () {
      var loc = JSON.parse(body);
      console.log(loc);
      res.json(loc);
    });
  });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SERVER is RUNNING ON PORT ${PORT}`);
  mongoose.connect(mongodburi, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
