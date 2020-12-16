const PORT = process.env.PORT || 3000

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session= require('express-session');
const passport= require('passport');
const passportLocalMongoose= require('passport-local-mongoose');

const app = express();
const ejs = require("ejs");

require('dotenv').config();


//BodyParser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}))

//Database URL 
const db = process.env.DATABASE || 'mondodb://localhost:27017/blogDB';

//ejs
app.set('view engine', 'ejs');
app.use(express.static("public"));

//session
app.use(session({
  secret: 'md-login2020',
  resave: false,
  saveUninitialized: false
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//Connect to database
mongoose
    .connect(db,
          {
              useUnifiedTopology: true,
              useNewUrlParser: true,
              useFindAndModify: true
          }
        )
        .then(() => console.log(`MongoDB Connected`))
        .catch(err => {
            console.log(err)
            console.log(db)
        }); 
mongoose.set("useCreateIndex",true); //signup-login

//ser-schema
const userSchema=new mongoose.Schema({
	username: String,
	password: String,
	name: String
});

userSchema.plugin(passportLocalMongoose);

const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy()); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(req,res) => {
    res.send("Home PAge;")
});

//all approved blogs->get
app.get("/blog/show",function(req,res){
	Approved.find({},function(err,items){
     res.render("show",{newitems:items});
	});
    
});

//admin pending blogs->get
app.get("/admin/blog/approve",function(req,res){
	Pending.find({},function(err,items){
     res.render("admin-approve",{newitems:items});
	});
    
});

//admin delete pending->get
app.post("/admin/delete",function(req,res){
    const button=req.body.delete;
   // console.log(button+" ");
   Pending.findByIdAndRemove(button,function(err){
     if(!err){
     	//console.log("Succesfully deleted!");
     	res.redirect("/admin/blog/approve");
     }
   });
});

//admin approve->post 
app.post("/admin/approve",function(req,res){
	const button=req.body.approve;
    var Title="start";
	var Content="start";
	Pending.findById(button,function(err,pending){
        if(!err){
             Title=pending.title;
             Content=pending.content;
             const approved = new Approved ({
                    title: Title,
                   content: Content                  //author to be added
	               });               
	          approved.save();
	        //  console.log("Approved "+Title);
        }
	});
	
	Pending.findByIdAndRemove(button,function(err){
     if(!err){
     	//console.log("Succesfully deleted!");
     	res.redirect("/admin/blog/approve");
     }
   });
});

//compose-> get
app.get("/blog/compose",function(req,res){
	res.render("compose");
});

//submit compose blog->post
app.post("/blog/compose",function(req,res){
	const Title=req.body.title;
	const Content =req.body.content;
	const pending = new Pending ({
       title: Title,
       content: Content                 //author to be added
	}); 
	pending.save();
	//console.log("Pending "+Title);
	res.redirect("/blog/compose");
});

//signup
app.get("/signup",function(req,res){
    res.render("signup");
});
app.post("/signup",function(req,res){
	req.body.name
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username }), req.body.password,function(err,user){
         if(err){
             console.log(err);
             res.redirect("/signup"); 
         }
         passport.authenticate("local")(req,res,function(){
             console.log(req.body.name);
             User.findOneAndUpdate({username:req.body.username},{name: req.body.name}, function(err, result) {
    if (err) {
      console.log(err);
    } else { 
    console.log(result);
    //res.redirect("/"); //home
    }
  });
            
   });
        });
    });
//signin
app.get("/signin",function(req,res){
    res.render("signin");
});
app.post("/signin",function(req,res){
     const user= new User({
     	username :req.body.username,
     	password :req.body.password
     });

     req.login(user, function(err){
     	if(err) {
     		console.log(err);
     	}
     	else {
     		passport.authenticate("local")(req,res,function(){
             console.log("successful");
           // res.redirect("/");  //home
   });
     	}
     });

});
//logout
/*
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
}) */


app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})
