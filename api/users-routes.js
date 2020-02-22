const cookieParser = require('cookie-parser');
var csrf = require('csurf');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const bodyParser = require('body-parser');

// const Product = require('../Models/product');
// var Cart = require('../Models/cart');

//load User model
const User = require('../Models/Users');
var csrfProtection = csrf({cookie : true});


//Route  api/resgister
//method POST
//Access Public
router.post('/register',csrfProtection,(req,res)=> 
{
    let errors=[];
    if(req.body.password != req.body.password2){errors.push({text:'Passwords do not match'});}
    if(req.body.password.length < 4 ){errors.push({text:'Password must be atleast four charcters'});}
    if(!req.body.fullName){errors.push({text:'Please add a Full Name'});}
    if(!req.body.email){errors.push({text:'Please add a email'});}
    if(!req.body.password){errors.push({text:'Please add a Password'});}
    if(!req.body.mobileNo){errors.push({text:'Please add a Mobile Number'});}
    var email =req.body.email.toLowerCase();
    //console.log(email);
    if(errors.length > 0 ){
        res.render('register',{
            errors: errors,
            fullName: req.body.fullName,
            email: email,
            password: req.body.password,
            mobileNo: req.body.mobileNo
        });
    } 
    else{
        //Find if email or mobile no. already exist
        User.findOne({ email: req.body.email })
        .then( user=> {
            if(user){
                req.flash('error_msg','Email already registered'); 
                res.redirect('/register');
            }
            else
            {
                    //create User Model
                    const newUser = new User({
                    fullName: req.body.fullName,
                    email : email,
                    password : req.body.password,
                    mobileNo : req.body.mobileNo,
                    });
            
                    //bycrypt password    
                    bcrypt.genSalt(6, (err,salt) => {
                    bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err) {
                        throw err;
                    }
                    newUser.password = hash;

                    //Save user info in DB
                    newUser.save()
                    .then(user => { 
                        //console.log(user); 
                        return req.flash('success_msg','You are now registered and can log in'),
                        res.redirect('/login');
                    })
                    .catch(err => console.log(err));
                    })
                    })
            }
        });
  
    }   
});


//Route  api/resgister
//method POST
//Access Public

router.post('/login', (req, res, next) => {
    
    passport.authenticate('local',{
       successRedirect: '/profile',
      // successRedirect: res.render('clothing&accessories' , { title :req.body.email }), 
        failureRedirect:'/login',
        failureFlash: true
    })(req, res, next);
});




module.exports = router;