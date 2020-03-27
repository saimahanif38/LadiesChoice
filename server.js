const cookieParser = require('cookie-parser');
var csrf = require('csurf');
const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const exphb =  require('express-handlebars');
const path = require('path');
const multer = require('multer');
const {ensureAuthenticated} = require('./helpers/auth');
var MongoStore = require('connect-mongo')(session);

const app = express();
var csrfProtection = csrf({cookie : true});
const Product = require('./Models/product');
var Cart = require('./Models/cart');
var Order = require('./Models/order');
var UserModel = require('./Models/Users');
var FeedbackModel = require('./Models/feedback');
//require('./seed/product-seeder');
// Passport config
require('./config/passport')(passport);

//handelbar middleware
app.engine('handlebars',exphb({ defaultLayout : 'main' }));
app.set('view engine','handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json()); 

//router.use(csrfProtection);
app.use(cookieParser());

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized:false,
    store: new MongoStore({ mongooseConnection: mongoose.connection}),
    cookie: {maxAge : 360 * 60 * 1000} 
  }))

  app.use(flash());
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  //Global variables
  app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.admin = req.admin || null;
    res.locals.session = req.session;
    next();
  });

//static folder path
app.use(express.static(path.join(__dirname,'public')));

//PORT no.
const PORT = process.env.PORT || 5000;

//DB url
const dbURL = 'mongodb://localhost/Ladies-Choice';
//const dbURL = 'mongodb+srv://saima:recite786@cluster0-j3mda.mongodb.net/Ladies_Choice?retryWrites=true&w=majority';

//user api routes
const users = require('./api/users-routes');

//use route
app.use('/api',users);

var loginFlag=false;

//Login route
app.get('/login',csrfProtection,(req,res) =>{
    if (adminFlag===true){
        return res.render('admin-panel',{admin:admin,message:'Admin dont have access to user log in!'});
    }
    
    res.render('login',  {csrfToken : req.csrfToken()});
});

//Register route
app.get('/register',csrfProtection,(req,res) => {
    if (adminFlag===true){
        return res.render('admin-panel',{admin:admin,message:'Admin dont have access to user Registration!'});
    }
    res.render('register',{csrfToken : req.csrfToken()});
    
});


//product route
app.get('/view/:id',(req,res) => {
    var productId = req.params.id;
    Product.findById(productId, function(err,product){
        if (err){
            throw err;
        }
        const img1= product.imagePath1;
        res.render('view-page',{productTitle: product.title,price:product.price,img:img1});
    });
});

var url;
//add-to-cart
app.get('/add-to-cart/:id',function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function(err,product){
        if (err){
            throw err;
        }
        cart.add(product, product.id);
        req.session.cart = cart;
       res.redirect(url);
    });
});



//reduce route
app.get('/reduce/:id',function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function(err,product){
        if (err){
            throw err;
        }
        cart.reduceByOne(productId);
        req.session.cart = cart;
       res.redirect('/mycart');
    });
});

//remove route
app.get('/remove/:id',function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function(err,product){
        if (err){
            throw err;
        }
        cart.removeItem(productId);
        req.session.cart = cart;
       res.redirect('/mycart');
    });
});


//Index route
app.get('/',(req,res) => {

    res.render('index',{admin:admin}); 
});

//Admin Panel
app.get('/admin-login', (req,res) => {
    console.log('loginFlag'+loginFlag);
    if( loginFlag===true){
        console.log('1*******');
        req.flash('error_msg','You can not logged in to admin panel until you logout from user profile!');
        return res.redirect('/profile');
    }
    if (adminFlag===true){
        console.log('2*******');
        console.log(admin);
        req.flash('success_msg', 'Admin already logged in!');
        return res.render('admin-panel',{admin:admin,message:'Admin already logged in!'});
         //res.redirect('admin-panel');
    }
    res.render('admin-login');
}
);

//add-item route
app.get('/add-item',(req,res) => {
    if( loginFlag===true){
        req.flash('error_msg','User dont have access to add item!');
        return res.redirect('/profile');
    }
    if (adminFlag===false){
        req.flash('error_msg','In order to access Add Item page you must login from admin panel');
        return res.redirect('/admin-login');
    }
    admin ='Saima';
    res.render('add-item',{admin:admin}); 
});

//using Multer
var Storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
    }
  });

//using Multer
var upload = multer({
    storage:Storage
}).array('file',2);

//upload route
app.post('/upload', upload,function(req,res,next){

    var fileName = req.files;
    if(fileName  == null || req.body.price == null || req.body.title == null)
        {
            req.flash('error_msg', 'Fill all the inputs!');
            return res.redirect('/add-item');
        }

        var productDetails = new Product({
            imagePath1 : 'uploads/'+fileName[0].filename,
            imagePath2 : 'uploads/'+fileName[1].filename,
            title : req.body.title,
            price:req.body.price
        });
        
        productDetails.save(function(err,result){
            if(err) throw err;
            req.flash('success_msg', 'Your data have been entred in our data base!');
           res.redirect('/add-item');
        });
});


  //update product route
  app.post('/edit-product/:id',upload, (req, res) => {
    
    if( loginFlag===true){
        req.flash('error_msg','User dont have access to users list');
        return res.redirect('/profile');
    }
    if (adminFlag===false){
        req.flash('error_msg','In order to access users list page you must login from admin panel');
        return res.redirect('/admin-login');
    }
    var fileName=req.files;
    var img1, img2;
    if(req.body.result.toLowerCase() == 'yes') {
        img1 = 'uploads/'+fileName[0].filename;
        img2 = 'uploads/'+fileName[1].filename;
    }
    else {
        img1 = req.body.img1;
        img2 = req.body.img2;
    }

   Product.findById(req.params.id,function(err,pd){
        if(err){
           return console.log(err);
         }
         
         const productUpdate =
         {
            imagePath1 :img1,
            imagePath2 :img2,
            title:req.body.title,
            price:req.body.price
         }
         Product.findByIdAndUpdate(req.params.id,productUpdate,function(err,user){
            if(err){
               return console.log(err);
             }
             //console.log('done');
             res.redirect('/all-products');
             
        });
        
    });
 });

 //Delete Product route
app.get('/delete-product/:id', (req, res) => {
    console.log(req.params.id);
    if( loginFlag===true){
        req.flash('error_msg','User dont have access to users list');
        return res.redirect('/profile');
    }
    if (adminFlag===false){
        req.flash('error_msg','In order to access users list page you must login from admin panel');
        return res.redirect('/admin-login');
    }
    Product.findByIdAndDelete(req.params.id,function(err,doc){
        if(err){
           return console.log(err);
         }
         console.log(doc);
        res.redirect('/all-products');
    });
    
  });
//Admin Panel
app.get('/users-list', (req,res) => {
    var num = [];
    if( loginFlag===true){
        req.flash('error_msg','User dont have access to users list');
        return res.redirect('/profile');
    }
    if (adminFlag===false){
        req.flash('error_msg','In order to access users list page you must login from admin panel');
        return res.redirect('/admin-login');
    }
    UserModel.find(function(err,users){
        if(err){
           return console.log(err);
         }
         for(var i=1; i <= users.length; i++) num.push(i);
         //console.log(num);
        res.render('users-list',{user_panel : users,admin:admin,seqNo: num}); 
    });
    
}
);


//Delete route
app.get('/delete/:id', (req, res) => {
    

    UserModel.findOneAndDelete(req.params.id,function(err,user){
        if(err){
           return console.log(err);
         }
         
        res.redirect('/users-list');
    });
    
  });


//Edit route
app.get('/edit/:id', (req, res) => {
    console.log(req.params.id);

    UserModel.findById(req.params.id,function(err,user){
        if(err){
           return console.log(err);
         }
         
        res.render('edit-user',{userData : user,admin:admin}); 
    });
    
  });

//update route
app.post('/edit/:id', (req, res) => {
    
    const UserNewData = [];
    UserModel.findById(req.params.id,function(err,user){
        if(err){
           return console.log(err);
         }
         
         const UserNewData =
         {
             fullName:req.body.fullName,
             email:req.body.email,
             password:user.password,
             mobileNo:req.body.mobileNo
         }
         //console.log(UserNewData);
         UserModel.findByIdAndUpdate(req.params.id,UserNewData,function(err,user){
            if(err){
               return console.log(err);
             }
             //console.log('done');
             res.redirect('/users-list');
             
        });
    });
 });
//edit product 
app.get('/edit-product/:id', (req, res) => {
    console.log(req.params.id);

    Product.findById(req.params.id,function(err,data){
        if(err){
           return console.log(err);
         }
         
        res.render('edit-product',{productData : data,admin:admin}); 
    });
    
  });

//Admin Panel
app.get('/admin-panel', (req,res) => {
    if( loginFlag===true){
        req.flash('error_msg','You can not logged in to admin panel until you logout from user profile!');
        return res.redirect('/profile');
    }
    if (adminFlag===false){
        req.flash('error_msg','In order to access admin panel you must login from admin login');
        return res.redirect('/admin-login');
    }
    res.render('admin-panel',{admin:admin});
}
);
var admin='',adminFlag=false;
//Admin post
app.post('/admin-login-check',(req,res)=>{

    if(req.body.emailAdmin === 'saimahanif1938@gmail.com' && req.body.password === '12345')
    {
        adminFlag=true;
        admin='SAIMA';
        res.render('admin-panel',{admin:admin});
    }
    else {
        admin=null;
        req.flash('error_msg','Wrong Email or Password!'); 
        return res.redirect('/admin-login');
    }
 });


//orders for admin panel
app.get('/orders', (req,res) => {
    var counter = [];
    var count=0;
    if( loginFlag===true){
        req.flash('error_msg','Users dont have access to all orders');
        return res.redirect('/profile');
    }
    //console.log(loginFlag);
    if (adminFlag===false){
        req.flash('error_msg','In order to access orders page you must login from admin panel');
        return res.redirect('/admin-login');
    }
    Order.find(function(err,orders){
        if(err){
            return res.write('Error!');
        }
        //console.log(orders);
        var cart;
        var address_array=[];
        var name_array=[];
        orders.forEach(function(order){
            address_array.push(order.address);
            name_array.push(order.name);
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
            count++;
            counter.push(count);
        });
        // console.log(address_array);
        //console.log(counter);
        res.render('orders',{orders: orders,address:address_array,name: name_array, admin:admin,counter:counter});
    });
}
);

//logout_admin
app.get('/logout_admin', (req, res) => {
    adminFlag=false;
    admin='';
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/clothing&accessories');
  });

// Logout User
app.get('/logout', (req, res) => {
    loginFlag=false;
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/clothing&accessories');
  });

//contact form
app.get('/contact-us', (req, res) => {
    res.render('contact-us');
  });

  //contact form
app.post('/feedback', (req, res) => {
    const name= req.body.txtName;
    const email= req.body.txtEmail;
    const phone= req.body.txtPhone;
    const message= req.body.txtMsg;
    
    if(name == '' || email == '' || phone== '' || message == '') {
        req.flash('error_msg','Kindly Fill all input fields!'); 
        return res.redirect('/contact-us');
    }
    if(phone.length < 11 || phone.length >11) {
        req.flash('error_msg','Phone Number must be of 11 digits!'); 
        return res.redirect('/contact-us');
    }
   else{
        var feedback = new FeedbackModel ({
        name: name,
        email: email,
        phone: phone,
        message: message
      });
      feedback.save(function(err,result){
        if(err) throw err;
        else{
            req.flash('success_msg','Your feedback is submitted we will contact you soon!'); 
            return res.redirect('/contact-us');
        } 
    });
   }
  });

//My Cart route
app.get('/mycart',function(req,res,next){
    if (adminFlag===true){
        return res.render('admin-panel',{admin:admin,message:'Admin dont have access to user\'s My cart!'});
    }
    if(!req.session.cart)
    {
        return res.render('mycart', {products: null});
    }
    var cart = new Cart(req.session.cart);
    return res.render('mycart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

// check-out route
app.get('/check-out',ensureAuthenticated,function(req,res,next){
    if(!req.session.cart)
    { return res.render('mycart'); }
    url= req.url;
    var cart = new Cart(req.session.cart);
    return res.render('check-out',{total: cart.totalPrice});
});

//users-feedback route
app.get('/users-feedback',function(req,res,next){
    
    if( loginFlag===true){
        req.flash('error_msg','User dont have access to Feedback list');
        return res.redirect('/profile');
    }
    if (adminFlag===false){
        req.flash('error_msg','In order to access Feedback list page you must login from admin panel');
        return res.redirect('/admin-login');
    }
    
    FeedbackModel.find(function(err,msg){
        if(err){
           return console.log(err);
         }
        res.render('users-feedback',{feedbacks : msg,admin:admin}); 
    });
});

//see all products route 
app.get('/all-products',function(req,res,next){
    
    if( loginFlag===true){
        req.flash('error_msg','User dont have access to Feedback list');
        return res.redirect('/profile');
    }
    if (adminFlag===false){
        req.flash('error_msg','In order to access Feedback list page you must login from admin panel');
        return res.redirect('/admin-login');
    }
    
    Product.find(function(err,doc){
        if(err){
           return console.log(err);
         }
        res.render('all-products',{doc : doc,admin:admin}); 
    });
});

//Profile route
app.get('/profile',ensureAuthenticated,(req,res) =>{
    loginFlag= true;
    Order.find({user: req.user},function(err,orders){
        if(err){
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order){
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('profile',{orders: orders});
    });
    
});

//Clothing & Accessories route
app.get('/clothing&accessories',(req,res) => {
    res.render('clothing&accessories',{admin:admin});
});

// offer&sale route
app.get('/offer&sale', ensureAuthenticated, (req,res) => {
    var bags=[];
    url= req.url;
    Product.find(function (err, docs){
        var productChunks = [];
        var chunkSize = 4;
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
               
                if(productChunks[i][j].title === 'Women Bags' ){
                    bags.push(productChunks[i][j]);
                }
                //console.log(productChunks[i][j].title);
                if(x == docs.length) break;
            }
        } 
        var productChunks2 = [];
        for(var i=0; i < bags.length; i+=chunkSize)
        {
            productChunks2.push(bags.slice(i, i +chunkSize));
        }
        /* yeh code*/
        res.render('offer&sale',{products :  productChunks2});
    });
});

//women-maxi route
app.get('/women-maxi',(req,res) => {
    url= req.url;
    Product.find(function (err, docs){
        var productChunks = [];
        var chunkSize = 4;
        var maxi=[];
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
                if(productChunks[i][j].title === 'Maxi' ){
                    maxi.push(productChunks[i][j]);
                  }
                if(x == docs.length) break;
            }
        } 
       
        var productChunks2 = [];
        var chunkSize = 4;
        for(var i=0; i < maxi.length; i+=chunkSize)
        {
            productChunks2.push(maxi.slice(i, i +chunkSize));
        }
    res.render('women-maxi',{products :  productChunks2,admin:admin});
});

} );

//About Us route
app.get('/aboutus',(req,res) => {
    res.render('aboutus',{admin:admin});
});







//shalwarKameez route
app.get('/shalwarKameez',function(req,res,next){
    url= req.url;
    var shalwarKameezArr=[];
    Product.find(function (err, docs){
        var productChunks = [];
        var chunkSize = 4;
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
               
                if(productChunks[i][j].title === 'Shalwar Qameez' ){
                  shalwarKameezArr.push(productChunks[i][j]);
                }
                //console.log(productChunks[i][j].title);
                if(x == docs.length) break;
            }
        } 
        var productChunks2 = [];
        for(var i=0; i < shalwarKameezArr.length; i+=chunkSize)
        {
            productChunks2.push(shalwarKameezArr.slice(i, i +chunkSize));
        }
        /* yeh code*/
        res.render('shalwarKameez',{products :  productChunks2,admin:admin});
    });
} );



//women-top-&-shirts route
app.get('/women-top-&-shirts',function(req,res,next){
    var TopsAndShirts=[];
    url= req.url;
    Product.find(function (err, docs){
        var productChunks = [];
        var chunkSize = 4;
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
               
                if(productChunks[i][j].title === 'Tops And Shirts' ){
                    TopsAndShirts.push(productChunks[i][j]);
                }
                //console.log(productChunks[i][j].title);
                if(x == docs.length) break;
            }
        } 
        var productChunks2 = [];
        for(var i=0; i <  TopsAndShirts.length; i+=chunkSize)
        {
            productChunks2.push(TopsAndShirts.slice(i, i +chunkSize));
        }
        /* yeh code*/
        res.render('women-top-&-shirts',{products :  productChunks2,admin:admin});
    });
} );




app.post("/charge",ensureAuthenticated, (req, res) => {
    var counter=0;
    if(!req.session.cart)
    res.render('mycart');
    var cart = new Cart(req.session.cart);
    //const stripe = require('stripe')('sk_test_hsQuBL1QqkJn7s2JhC7SBZbs00dJbSul2a');
    //conditions to check validation on email,address
    if(!req.body.name || !req.body.address)
    {
        req.flash('error_msg','Kindly Fill all input fields!'); 
        return res.redirect('/check-out');
    }
   // console.log(req.user);

            var order = new Order({
                user : req.user,
                cart: cart,
                address:req.body.address,
                name: req.body.name,
                zipcode:req.body.zipcode,
                phno:req.body.phno,
                alphno: req.body.alphno
            });
            order.save(function(err,result){});
            
        req.session.cart = null;
        req.flash('success_msg', 'You Have Successfully placed the order we will dispatch your order in 5 to 8 days!');
        res.redirect('/clothing&accessories');
     
  });


//   app.post("/charge",ensureAuthenticated, (req, res) => {
    
//     if(!req.session.cart)
//     res.render('mycart');
//     var cart = new Cart(req.session.cart);
//     //const stripe = require('stripe')('sk_test_hsQuBL1QqkJn7s2JhC7SBZbs00dJbSul2a');
//     //conditions to check validation on email,address
//     if(!req.body.name || !req.body.address)
//     {
//         req.flash('error_msg','Kindly Fill all input fields!'); 
//         return res.redirect('/check-out');
//     }
    
//     try {
//       stripe.customers
//         .create({
//           name: req.body.name,
//           source: req.body.stripeToken
//         })
//         .then(customer =>
//           stripe.charges.create({
//             amount:cart.totalPrice * 100,
//             currency: "usd",
//             customer: customer.id,
//             description: "Test Charge"
//           }, function (err, charge){
//             var order = new Order({
//                 user : req.user,
//                 cart: cart,
//                 address:req.body.address,
//                 name: req.body.name,
//                 paymentID: charge.id
//             });
//             order.save(function(err,result){});
//         })
//         )
//         .then(() => 
//         {
//         req.session.cart = null;
//         req.flash('success_msg', 'You Have Successfully paid the amount!');
//         res.redirect('/clothing&accessories');
//         })
//         .catch(err =>{ res.send('error:'+ err);});
//     } catch (err) { 
//       res.send('error');
//     }
//   });



//search route
app.post('/search',(req,res) => {
    const search_var = req.body.search.toLowerCase();
    if(search_var === 'bags' || search_var === 'bag' || search_var === 'women bag'|| search_var === 'women bags') 
        return res.redirect('/bag');

    else if(search_var === 'tops' || search_var === 'top' || search_var === 'shirts'|| search_var === 'shirt') 
        return res.redirect('/women-top-&-shirts');

    else if(search_var === 'maxi' || search_var === 'maxis') 
        return res.redirect('/women-maxi');

    else if(search_var === 'kameez' || search_var === 'shalwar kameez' || search_var === 'pakistani dress') 
        return res.redirect('/shalwarKameez');

    else if(search_var === 'kashmiri' || search_var === 'traditional dress' || search_var === 'traditional') 
        return res.redirect('/kashmiri');

    else if(search_var === 'shoes' || search_var === 'women shoe'||search_var === 'shoe' || search_var === 'women shoes') 
        return res.redirect('/shoes');

    else if(search_var === 'baby bags' || search_var === 'bag') 
        return res.redirect('/baby-frocks');

    else if(search_var === 'baby toy' || search_var === 'toy' || search_var === 'baby toys' || search_var === 'toys') 
        return res.redirect('/baby-toys');

    else if(search_var === 'baby bags' || search_var === 'baby bag') 
        return res.redirect('/baby-bags');
    else
        res.redirect('not-found');

});





app.get('/not-found',function(req,res,next){
    res.render('No-search-found');
});

//bag route
app.get('/bag',function(req,res,next){
    var bags=[];
    url= req.url;
    Product.find(function (err, docs){
        var productChunks = [];
        var chunkSize = 4;
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
               
                if(productChunks[i][j].title === 'Women Bags' ){
                    bags.push(productChunks[i][j]);
                }
                //console.log(productChunks[i][j].title);
                if(x == docs.length) break;
            }
        } 
        var productChunks2 = [];
        for(var i=0; i < bags.length; i+=chunkSize)
        {
            productChunks2.push(bags.slice(i, i +chunkSize));
        }
        /* yeh code*/
        res.render('bag',{products :  productChunks2,admin:admin});
    });
} );

//shoe route
app.get('/shoes',function(req,res,next){
    url= req.url;
    Product.find(function (err, docs){
        var productChunks = [];
        var shoe=[];
        var chunkSize = 4;
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
               
                if(productChunks[i][j].title === 'Women Shoes' ){
                    shoe.push(productChunks[i][j]);
                }
                //console.log(productChunks[i][j].title);
                if(x == docs.length) break;
            }
        } 
        var productChunks2 = [];
        for(var i=0; i <shoe.length; i+=chunkSize)
        {
            productChunks2.push(shoe.slice(i, i +chunkSize));
        }
        /* yeh code*/
        res.render('shoes',{products :  productChunks2,admin:admin});
    });
} );

//kashmiri route
app.get('/kashmiri',function(req,res,next){
    url= req.url;
    Product.find(function (err, docs){
        var productChunks = [];
        var kashmiri=[];
        var chunkSize = 4;
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
               
                if(productChunks[i][j].title === 'Women Traditional Kashmiri' ){
                    kashmiri.push(productChunks[i][j]);
                }
                //console.log(productChunks[i][j].title);
                if(x == docs.length) break;
            }
        } 
        var productChunks2 = [];
        for(var i=0; i < kashmiri.length; i+=chunkSize)
        {
            productChunks2.push(kashmiri.slice(i, i +chunkSize));
        }
        /* yeh code*/
        res.render('kashmiri',{products :  productChunks2,admin:admin});
    });
} );

//baby-frocks route
app.get('/baby-frocks',function(req,res,next){
    url= req.url;
    Product.find(function (err, docs){
        var productChunks = [];
        var babyFrocks=[];
        var chunkSize = 4;
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
               
                if(productChunks[i][j].title === 'Baby Frocks' ){
                    babyFrocks.push(productChunks[i][j]);
                }
                //console.log(productChunks[i][j].title);
                if(x == docs.length) break;
            }
        } 
        var productChunks2 = [];
        for(var i=0; i < babyFrocks.length; i+=chunkSize)
        {
            productChunks2.push(babyFrocks.slice(i, i +chunkSize));
        }
        /* yeh code*/
        res.render('baby-frocks',{products :  productChunks2,admin:admin});
    });
} );


//baby-toys route
app.get('/baby-toys',function(req,res,next){
    url= req.url;
    Product.find(function (err, docs){
        var productChunks = [];
        var babyToy=[];
        var chunkSize = 4;
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
               
                if(productChunks[i][j].title === 'Toy' ){
                    babyToy.push(productChunks[i][j]);
                }
                //console.log(productChunks[i][j].title);
                if(x == docs.length) break;
            }
        } 
        var productChunks2 = [];
        for(var i=0; i < babyToy.length; i+=chunkSize)
        {
            productChunks2.push(babyToy.slice(i, i +chunkSize));
        }
        /* yeh code*/
        res.render('baby-toys',{products :  productChunks2,admin:admin});
    });
} );

//baby-bags route
app.get('/baby-bags',function(req,res,next){
    url= req.url;
    Product.find(function (err, docs){
        var productChunks = [];
        var babybags=[];
        var chunkSize = 4;
        for(var i=0; i < docs.length; i+= chunkSize){
            productChunks.push(docs.slice(i, i +chunkSize));
        }
        var x=0;
        for(var i=0; i < productChunks.length; i++)
        {
            for(var j=0; j< chunkSize; j++){
              
                x++;
               
                if(productChunks[i][j].title === 'Baby Bags' ){
                    babybags.push(productChunks[i][j]);
                }
                //console.log(productChunks[i][j].title);
                if(x == docs.length) break;
            }
        } 
        var productChunks2 = [];
        for(var i=0; i < babybags.length; i+=chunkSize)
        {
            productChunks2.push(babybags.slice(i, i +chunkSize));
        }
        /* yeh code*/
        res.render('baby-bags',{products :  productChunks2,admin:admin});
    });
} );




//Mongoose middleware
mongoose.connect(dbURL,  { useNewUrlParser: true ,useUnifiedTopology: true })
.then( ()=> { console.log('MongoDB connected ') })
.catch( (error)=> { console.log(error) });


//Put server on listeniing mode
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
