var passport = require("passport");
var LocalStrategy = require("passport-local");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("../Models/User");
const Project = require("../Models/Project");
const UserSession = require("../Models/UserSession");
const express = require("express");
const router = express();
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, async function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Username is not valid!" });
      }
      if (await bcrypt.compare(password, user.encry_password)) {
        return done(null, user);
      }
      return done(null, false, { message: "Incorrect Password" });
    });
  })
);

router.use(session({ secret: "Shhhh! This is a secret!" }));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local"),
  async function (req, res) {
    let cookievalue = await bcrypt.hash("ProjectIt", 10);
    UserSession.create({
      userId: req.user.id,
      session: cookievalue,
    });
    res.cookie("sessionCookie", cookievalue);
    console.log("Welcome " + req.user.username + "!");
    res.send({
      user: req.user.id,
      message: "WELCOME BACK",
      cookie: cookievalue,
    });
  }
);

router.get("/checkUsername", async function (req, res) {
  const userName = req.query.username;
  console.log("Request is coming")
  User.findOne({username: userName}, (err, foundUser) => {
    if(foundUser){
      res.send({
        userExist: true
      })
    }
    else{
      res.send({
        userExist: false
      })
    }
  })
})

router.post("/signup", async function (req, res) {
  const hashedPass = await bcrypt.hash(req.query.password, 10);
  User.create(
    {
      name: req.query.name,
      username: req.query.username,
      emailId: req.query.email,
      encry_password: hashedPass,
      linkedIn: req.query.linkedIn,
      codeforces: req.query.codeforces,
      github: req.query.github,
      projects: [],
      bookmarks: [],
    },
    function (err, newUser) {
      if (err) {
        console.log(err);
      } else {
        console.log("Account created for " + newUser.username);
        res.send({
          username: newUser.username,
        });
      }
    }
  );
});

router.get("/logout", (req, res) => {
  const cookies = req.query.c.split(";");
  let cookieValue = null;
  cookies.forEach((cookie) => {
    if (cookie.split("=")[0].trim() === "sessionCookie") {
      cookieValue = decodeURIComponent(cookie.split("=")[1].trim());
      UserSession.deleteOne({ session: cookieValue }, () =>
        console.log("Session deleted")
      );
      res.clearCookie("sessionCookie").sendStatus(200);
      console.log("Logout successful!");
    }
  });
});

router.get("/user/:username", (req, res) => {
  User.findOne({ username: req.params.username }, (err, foundUser) => {
    if (err) console.log(err);
    else {
      Project.find({ user: foundUser._id }, (err, foundProjects) => {
        if (err) console.log(err);
        else {
          let returnJSON = {
            userDetails: foundUser,
            projects: foundProjects,
          };
          res.send(returnJSON);
        }
      });
    }
  });
});

router.get("/user", (req, res) => {
  const cookies = req.query.c.split(";");
  let cookieValue = null;
  cookies.forEach((cookie) => {
    if (cookie.split("=")[0].trim() === "sessionCookie") {
      cookieValue = decodeURIComponent(cookie.split("=")[1].trim());
      UserSession.findOne({ session: cookieValue }, (err, foundUserSession) => {
        User.findById(foundUserSession.userId, (err, foundUser) => {
          if (err) console.log(err);
          else {
            Project.find({ user: foundUser._id }, (err, foundProjects) => {
              if (err) console.log(err);
              else {
                let returnJSON = {
                  userDetails: foundUser,
                  projects: foundProjects,
                };
                res.send(returnJSON);
              }
            });
          }
        });
      });
    }
  });
});

module.exports = router;
