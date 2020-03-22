const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/checkauth');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'uploads/');
    },
    filename : function(req,file,cb){
        const now = new Date().toISOString();
        const date = now.replace(/:/g,'-');
        cb(null,date+ file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
     if(file.mimetype === 'image/jpeg' || file.mimetype ==='image/png' )   {
        cb(null,true);
     }else{
        cb(null,false);
     }
    
   

};

var upload = multer({
    storage : storage,
    limits:{
        fileSize: 1024 * 1024*5
    },
    fileFilter:fileFilter
});


const User = require('../models/user');



router.get('/',(req,res,next)=> {

    User.find()
    .select('name email interest userImage') //this columns were fetched we can also remove this select options for showing all columns
    .exec()
    .then(docs =>{
       const response = {
            count : docs.length,
            users : docs.map(doc =>{
                return{
                    name : doc.name,
                    email : doc.price,
                    interest : doc.interest,
                    _id : doc._id,
                    userImage : doc.userImage,
                    request:{
                        type : 'GET',
                        url : 'http://localhost:3000/users/'+doc._id
                    }


                }
            })
       };
       res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
           error : err
        });
    });
   

});

router.post('/',checkAuth,upload.single('userImage'),(req,res,next)=> {
    console.log(req.file);
    const user = new User({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        email : req.body.email,
        interest : req.body.interest,
        userImage : req.file.path
    });

    user.save().then(result =>{
       console.log(result);
       res.status(201).json({
        message:'Created User Successfully',
        createdUser: {
            name : result.name,
            email : result.price,
            _id: result._id,
            request :{
                type : 'GET',
                url : 'http://localhost:3000/users/'+result._id
            }
        }
  });
       
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
   
   


});

router.get('/:userId',(req,res,next)=> {

    const id = req.params.userId;
     User.findById(id)
     .exec()
     .then(doc => {
         console.log("From database",doc);
         if(doc){
             res.status(200).json({
                 user : doc,
                 request :{
                     type : 'GET',
                     description : 'GET_ALL_USERS',
                     url : 'http://localhost:3000/users'
                 }
             });
         }else{
             res.status(404).json({message:"No entry for this id"});
         }
         res.status(200).json(doc);
     })
     .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
     });

});


router.patch('/:userId',checkAuth,(req,res,next)=> {
    const id = req.params.userId;

    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    User.update({_id : id } , {$set: updateOps})
    .exec()
    .then(result => {
           console.log(result);
           res.status(200).json({
               message : 'User Updated',
               request : {
                   type :'GET',
                   url : 'http://localhost:3000/users/'+id
               }
           });
    }).catch( err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
    
});

router.delete('/:userId',checkAuth,(req,res,next)=> {
  const id = req.params.userId
   User.remove({_id : id})
   .exec()
   .then(result =>{
       res.status(200).json({
           message :'User Deleted'
       });
   })
   .catch(err =>{
       console.log(err);
       res.status(500).json({
           error :err
       });
   });  

});



module.exports = router;