const express = require('express');
const router = express();
const Project = require('../Models/Project');
const User = require('../Models/User');
const UserSession = require('../Models/UserSession');

router.get('/project/:field/all', (req, res) => {
  Project.find({'field': req.params.field}, async (err, foundProjects) => {
    if(err) res.send({error: err})
    else {
      res.send(foundProjects);
    }
  })
})

router.get('/project/:projectId', (req, res) => {
  Project.findById(req.params.projectId, async (err, foundProject) => {
    if(err) res.send({error: err})
    else {
      foundProject.views += 1;
      await foundProject.save();
      User.findById(foundProject.user, (err, foundUser) => {
        if(err) res.send({error: err});
        else {
          let returnJson = {
            project: foundProject,
            username: foundUser.username,
            linkedIn: foundUser.linkedIn
          }
          res.send(returnJson);
        }
      })
    }
  })
})

router.post('/project/add', (req, res) => {
  const cookies  = req.query.c.split(';');
  let cookieValue = null;
  cookies.forEach(cookie => {
    if(cookie.split('=')[0].trim() === 'sessionCookie') {
      cookieValue = decodeURIComponent(cookie.split('=')[1].trim());
      UserSession.findOne({session: cookieValue}, (err, foundUserSession) => {
        if(err) console.log(err);
        else {
          Project.create({
            ...req.body,
            reviews: [],
            user: foundUserSession.userId
          }, (err, createdProject) => {
            if(err) console.log(err);
            else {
              console.log("Project Created!");
              res.send(createdProject);
            }
          })
        }
      })
    }
  })
})


module.exports = router;