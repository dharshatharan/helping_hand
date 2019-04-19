const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


var dbUrl = "TYPE YOUR DATABASE URL HERE"

var User = mongoose.model('User', {
    username: String,
    password: String,
    name: String,
    position: String,
    location: String,
    description: String,
    login: Boolean
})

mongoose.connect(dbUrl, {useNewUrlParser: true}, (err) => {
    console.log('mongo db connection', err)
})



app.get("/", function(req, res) {
    User.find({}, function(err, posts) {
      if (err) {
        return console.log(err);
      }
      res.render("index.ejs", { posts: posts });
    });
  });

app.get("/sign_in", function(req, res) {
  res.render("sign_in.ejs");
});

app.post("/account/signin", function(req, res) {
  var un = req.body.user;
  console.log(un);
  User.findOne({username: un.username }, (err, user) => {
    if(err){
      res.render('error', { errorMsg: "Error blah blah" } )
    }else{
      if (!user) {
        console.log("username not found");
        res.render("resign_in.ejs")
      }else{
        if(un.password == user.password){
          res.render("account.ejs", {user : user})
        }else{
          res.render("resign_in.ejs")
        }
      }
   }
  })
});

app.get("/account/:usrn", function(req, res) {
  var uname = req.params.usrn
  User.findOne({username: uname }, (err, user) => {
  res.render("account.ejs", {user : user})
  })
});

app.post("/account", function(req, res) {
  var usrn = req.body.post.username;
  User.create(req.body.post, function(error, post) {
    if (error) {
      return console.log("This thing errored: " + error);
    }
    res.redirect("/account/" + usrn);
  });
});


function sendtoget(usrn){
  app.get('/account').send(usrn);
}

app.get("/sign_up", function(req, res) {
  res.render("sign_up.ejs");
});


app.post("/", function(req, res) {
    User.create(req.body.post, function(error, post) {
      if (error) {
        return console.log("This thing errored: " + error);
      }
      res.redirect("/");
    });
  });


var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})
