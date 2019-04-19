const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


var dbUrl = "mongodb+srv://admin:admin1@helpinghand-15arl.mongodb.net/test?retryWrites=true"

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
        // return console.log just consolidate console.log and return onto the same line
        return console.log(err);
      }
      console.log('what the hell /');
      res.render("index.ejs", { posts: posts });
    });
  });


function checklogincredentials(username, password){
  console.log('inside function' , username, password);
  User.find({username : username}, function(err) {
    if (err) {
      console.log("Username not found");
      return false;
    }else{

    user = User.find({username : username});
    if(user.password == password){
      return true;
    }
    else{

      return false;
    }
  }
  });
}

// app.get("/sign_in", function(req, res) {
//   res.render("sign_in.ejs");
// });

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
  console.log(uname);
  User.findOne({username: uname }, (err, user) => {
  res.render("account.ejs", {user : user})
  })
});



app.post("/account", function(req, res) {
  console.log('/accounts',req.body);
  var usrn = req.body.post.username;
  User.create(req.body.post, function(error, post) {
    if (error) {
      // return console.log just consolidate console.log and return onto the same line
      return console.log("This thing errored: " + error);
    }
    // res.redirect just redirects to the route specified
    // sendtoget(req.body.post.username);
    res.redirect("/account/" + usrn);
  });
});


function sendtoget(usrn){
  app.get('/account').send(usrn);
}


// app.post("/sign_in", function(req, res) {
//   console.log(req.body, req.body.password);
//   if(checklogincredentials(req.body.username, req.body.password) == true){
//     console.log("Login Successful");
//     res.redirect("/");
//   }else{
//     console.log("Login Unsuccessful");
//     res.render("sign_in.ejs");
//   }
// });



// app.get("/sign_in", (req, res) => {
//   User.findOne({username : req.body.username , password :req.body.password}, (err, login) => {
//     if (err){
//       console.log(err);
//     }else{
//       login = true;
//       res.render('sign_in.ejs', {output: req.params.username, login})
//     }
//   });
// });

app.get("/sign_up", function(req, res) {
  res.render("sign_up.ejs");
});


app.post("/", function(req, res) {
    console.log('/',req.body,'/');
    User.create(req.body.post, function(error, post) {
      if (error) {
        // return console.log just consolidate console.log and return onto the same line
        return console.log("This thing errored: " + error);
      }
      // res.redirect just redirects to the route specified
      console.log('test1');
      res.redirect("/");
      console.log('test2');
    });
  });


var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})