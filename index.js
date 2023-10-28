const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const app = express();
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
app.get("/api/location", (req, res) => {
  fetch("https://ipapi.co/json/")
    .then(function (response) {
      response.json().then((data) => {
        console.log(data);
        res.json(data);
      });
    })
    .catch(function (error) {
      console.log(error);
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
