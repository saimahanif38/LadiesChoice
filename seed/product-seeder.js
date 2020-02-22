const Product = require('../Models/product');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Ladies-Choice');


var products = [
    //Shalwar Qameez
    new Product({
        imagePath1:'img/sh1.jpg',
        imagePath2:'img/sh2.jpg',
        title:'Shalwar Qameez',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/sh1.jpg',
        imagePath2:'img/sh2.jpg',
        title:'Shalwar Qameez',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/sh1.jpg',
        imagePath2:'img/sh2.jpg',
        title:'Shalwar Qameez',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/sh1.jpg',
        imagePath2:'img/sh2.jpg',
        title:'Shalwar Qameez',
        price: 40.00
    }),
    new Product({
        imagePath1:'img/sh1.jpg',
        imagePath2:'img/sh2.jpg',
        title:'Shalwar Qameez',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/sh1.jpg',
        imagePath2:'img/sh2.jpg',
        title:'Shalwar Qameez',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/sh1.jpg',
        imagePath2:'img/sh2.jpg',
        title:'Shalwar Qameez',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/sh1.jpg',
        imagePath2:'img/sh2.jpg',
        title:'Shalwar Qameez',
        price: 40.00
    }),
    //Maxi
    new Product({
        imagePath1:'img/maxi.jpg',
        imagePath2:'img/maxi2.jpg',
        title:'Maxi',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/maxi.jpg',
        imagePath2:'img/maxi2.jpg',
        title:'Maxi',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/maxi.jpg',
        imagePath2:'img/maxi2.jpg',
        title:'Maxi',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/maxi.jpg',
        imagePath2:'img/maxi2.jpg',
        title:'Maxi',
        price: 40.00
    }),
    new Product({
        imagePath1:'img/maxi.jpg',
        imagePath2:'img/maxi2.jpg',
        title:'Maxi',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/maxi.jpg',
        imagePath2:'img/maxi2.jpg',
        title:'Maxi',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/maxi.jpg',
        imagePath2:'img/maxi2.jpg',
        title:'Maxi',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/maxi.jpg',
        imagePath2:'img/maxi2.jpg',
        title:'Maxi',
        price: 40.00
    }),
    //Tops and Shirts
    new Product({
        imagePath1:'img/pink-casual-2.jpg',
        imagePath2:'img/pink-casual-2of2.jpg',
        title:'Tops And Shirts',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/pink-casual-2.jpg',
        imagePath2:'img/pink-casual-2of2.jpg',
        title:'Tops And Shirts',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/pink-casual-2.jpg',
        imagePath2:'img/pink-casual-2of2.jpg',
        title:'Tops And Shirts',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/pink-casual-2.jpg',
        imagePath2:'img/pink-casual-2of2.jpg',
        title:'Tops And Shirts',
        price: 40.00
    }),
    new Product({
        imagePath1:'img/pink-casual-2.jpg',
        imagePath2:'img/pink-casual-2of2.jpg',
        title:'Tops And Shirts',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/pink-casual-2.jpg',
        imagePath2:'img/pink-casual-2of2.jpg',
        title:'Tops And Shirts',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/pink-casual-2.jpg',
        imagePath2:'img/pink-casual-2of2.jpg',
        title:'Tops And Shirts',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/pink-casual-2.jpg',
        imagePath2:'img/pink-casual-2of2.jpg',
        title:'Tops And Shirts',
        price: 40.00
    }),
    //Women Bags
    new Product({
        imagePath1:'img/bag1.jpg',
        imagePath2:'img/bag1of1.jpg',
        title:'Women Bags',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/bag1.jpg',
        imagePath2:'img/bag1of1.jpg',
        title:'Women Bags',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/bag1.jpg',
        imagePath2:'img/bag1of1.jpg',
        title:'Women Bags',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/bag1.jpg',
        imagePath2:'img/bag1of1.jpg',
        title:'Women Bags',
        price: 40.00
    }),
    new Product({
        imagePath1:'img/bag1.jpg',
        imagePath2:'img/bag1of1.jpg',
        title:'Women Bags',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/bag1.jpg',
        imagePath2:'img/bag1of1.jpg',
        title:'Women Bags',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/bag1.jpg',
        imagePath2:'img/bag1of1.jpg',
        title:'Women Bags',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/bag1.jpg',
        imagePath2:'img/bag1of1.jpg',
        title:'Women Bags',
        price: 40.00
    }),
    //Women Shoes
    new Product({
        imagePath1:'img/shoes1.jpg',
        imagePath2:'img/shoes2.jpg',
        title:'Women Shoes',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/shoes3.jpg',
        imagePath2:'img/shoes4.jpg',
        title:'Women Shoes',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/shoes1.jpg',
        imagePath2:'img/shoes2.jpg',
        title:'Women Shoes',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/shoes3.jpg',
        imagePath2:'img/shoes4.jpg',
        title:'Women Shoes',
        price: 40.00
    }),
    new Product({
        imagePath1:'img/shoes1.jpg',
        imagePath2:'img/shoes2.jpg',
        title:'Women Shoes',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/shoes3.jpg',
        imagePath2:'img/shoes4.jpg',
        title:'Women Shoes',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/shoes1.jpg',
        imagePath2:'img/shoes2.jpg',
        title:'Women Shoes',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/shoes3.jpg',
        imagePath2:'img/shoes4.jpg',
        title:'Women Shoes',
        price: 40.00
    }),
    //Women Traditional Kashmiri
    new Product({
        imagePath1:'img/TD1.jpg',
        imagePath2:'img/TD2.jpg',
        title:'Women Traditional Kashmiri',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/TD3.jpg',
        imagePath2:'img/TD4.jpg',
        title:'Women Traditional Kashmiri',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/TD1.jpg',
        imagePath2:'img/TD2.jpg',
        title:'Women Traditional Kashmiri',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/TD3.jpg',
        imagePath2:'img/TD4.jpg',
        title:'Women Traditional Kashmiri',
        price: 40.00
    }),
    new Product({
        imagePath1:'img/TD1.jpg',
        imagePath2:'img/TD2.jpg',
        title:'Women Traditional Kashmiri',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/TD3.jpg',
        imagePath2:'img/TD4.jpg',
        title:'Women Traditional Kashmiri',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/TD1.jpg',
        imagePath2:'img/TD2.jpg',
        title:'Women Traditional Kashmiri',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/TD3.jpg',
        imagePath2:'img/TD4.jpg',
        title:'Women Traditional Kashmiri',
        price: 40.00
    }),
    //Baby Frocks
    new Product({
        imagePath1:'img/baby-frock1.jpg',
        imagePath2:'img/baby-frock2.jpg',
        title:'Baby Frocks',
        price: 10.00
    }), 
    new Product({
        imagePath1:'img/baby-frock1.jpg',
        imagePath2:'img/baby-frock2.jpg',
        title:'Baby Frocks',
        price: 20.00
    }),  
    new Product({
        imagePath1:'img/baby-frock1.jpg',
        imagePath2:'img/baby-frock2.jpg',
        title:'Baby Frocks',
        price: 30.00
    }),  
    new Product({
        imagePath1:'img/baby-frock1.jpg',
        imagePath2:'img/baby-frock2.jpg',
        title:'Baby Frocks',
        price: 40.00
    }),
    new Product({
        imagePath1:'img/baby-frock1.jpg',
        imagePath2:'img/baby-frock2.jpg',
        title:'Baby Frocks',
        price: 10.00
    }), 
    new Product({
        imagePath1:'img/baby-frock1.jpg',
        imagePath2:'img/baby-frock2.jpg',
        title:'Baby Frocks',
        price: 20.00
    }),  
    new Product({
        imagePath1:'img/baby-frock1.jpg',
        imagePath2:'img/baby-frock2.jpg',
        title:'Baby Frocks',
        price: 30.00
    }),  
    new Product({
        imagePath1:'img/baby-frock1.jpg',
        imagePath2:'img/baby-frock2.jpg',
        title:'Baby Frocks',
        price: 40.00
    }),
    //Toys
    new Product({
        imagePath1:'img/toy-1.jpg',
        imagePath2:'img/toy2.jpg',
        title:'Toy',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/toy-1.jpg',
        imagePath2:'img/toy2.jpg',
        title:'Toy',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/toy-1.jpg',
        imagePath2:'img/toy2.jpg',
        title:'Toy',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/toy-1.jpg',
        imagePath2:'img/toy2.jpg',
        title:'Toy',
        price: 40.00
    }),
    new Product({
        imagePath1:'img/toy-1.jpg',
        imagePath2:'img/toy2.jpg',
        title:'Toy',
        price: 10.00
    }),
    new Product({
        imagePath1:'img/toy-1.jpg',
        imagePath2:'img/toy2.jpg',
        title:'Toy',
        price: 20.00
    }),
    new Product({
        imagePath1:'img/toy-1.jpg',
        imagePath2:'img/toy2.jpg',
        title:'Toy',
        price: 30.00
    }),
    new Product({
        imagePath1:'img/toy-1.jpg',
        imagePath2:'img/toy2.jpg',
        title:'Toy',
        price: 40.00
    }),
    //Baby Bags
    new Product({
        imagePath1:'img/baby-bag1.jpg',
        imagePath2:'img/baby-bag2.jpg',
        title:'Baby Bags',
        price: 10.00
    }), 
    new Product({
        imagePath1:'img/baby-bag1.jpg',
        imagePath2:'img/baby-bag2.jpg',
        title:'Baby Bags',
        price: 20.00
    }),  
    new Product({
        imagePath1:'img/baby-bag1.jpg',
        imagePath2:'img/baby-bag2.jpg',
        title:'Baby Bags',
        price: 30.00
    }),  
    new Product({
        imagePath1:'img/baby-bag1.jpg',
        imagePath2:'img/baby-bag2.jpg',
        title:'Baby Bags',
        price: 40.00
    }),
    new Product({
        imagePath1:'img/baby-bag1.jpg',
        imagePath2:'img/baby-bag2.jpg',
        title:'Baby Bags',
        price: 10.00
    }), 
    new Product({
        imagePath1:'img/baby-bag1.jpg',
        imagePath2:'img/baby-bag2.jpg',
        title:'Baby Bags',
        price: 20.00
    }),  
    new Product({
        imagePath1:'img/baby-bag1.jpg',
        imagePath2:'img/baby-bag2.jpg',
        title:'Baby Bags',
        price: 30.00
    }),  
    new Product({
        imagePath1:'img/baby-bag1.jpg',
        imagePath2:'img/baby-bag2.jpg',
        title:'Baby Bags',
        price: 40.00
    })         
];

var done=0;
for (var i=0; i<products.length; i++){
    products[i].save(function(err,result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}