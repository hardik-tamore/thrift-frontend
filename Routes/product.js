const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const fs = require('fs')
const router = express.Router();
const Product = require('../Models/product')
const {google} = require('googleapis')
const CLIENT_ID = '950238006168-cnncgb4m4b101r1vusjbh4aoh0ndsoeo.apps.googleusercontent.com'
const CLIENT_SECRET ='99PLsfa00rHIU3HQ5xFFKfyV'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04_7MU9CQ-KEKCgYIARAAGAQSNwF-L9IrTdsd8YrhJTrsGpuaj0_Ie35wMGcpElUTJt5AucY6RDNWRw1fQF0mgao4Orw-T8ibvZc'

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)
oauth2Client.setCredentials({refresh_token : REFRESH_TOKEN})
const drive = google.drive({
    version : 'v3',
    auth : oauth2Client
})



router.get('/',async(req, res)=>{
    try {
        const products = await Product.find();
        res.json(products);
    }
    catch(err){
        res.send('Error '+ err)
    }
});

router.get('/:id',async(req, res)=>{
    try {
        const product = await Product.findById(req.params.id );
        res.json(product);
    }
    catch(err){
        res.send('Error '+ err)
    }
});


router.patch('/user/:id', async (req, res) => {
    console.log(req.body.data)
	try {
		const product = await Product.findOne({ _id: req.params.id })
			product.Status = 'Sold'
		
        console.log(req.body.name);
        product.customer.name =  req.body.name;
        product.customer.user_name =  req.body.username? req.body.username : null;
        product.customer.phone =  req.body.phone? req.body.phone : null;
        product.customer.email =  req.body.email? req.body.email : null;
        product.customer.address_1 =  req.body.address? req.body.address : null;
        //product.customer.address_2 =  req.body.address_2? req.body.address_2 : null;
        product.customer.pincode =  req.body.pincode? req.body.pincode : null;
        product.customer.payment_mode =  req.body.paymentmode? req.body.paymentmode : null;
	

		await product.save()
		res.send(product)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})




// router.post('/add/', async(req, res)=>{
  

//     console.log(req.body)
//     const newProduct = new Product({
 
//          Name : req.body.Name,
//          Status : "New",
//         Price : req.body.Price,
//         Size: req.body.Size,
//         Condition : req.body.Condition,
//         Condition_desc : req.body.Condition_desc,
//         Chest : req.body.Chest,
//         Length : req.body.Length,
//         Shoulder : req.body.Shoulder
//     });
//   //  console.log(newdisease)
    
//     try{
//         const response = await newProduct.save() ;
//         if(!response) throw Error("Something went wrong")
//     }
//     catch(err){
//         res.json({message : err})
//     }
  
   
// });



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname)
      }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
let upload = multer({ storage, fileFilter });
// const storage = multer.memoryStorage();
// let upload = multer({storage})


router.post('/add',upload.single('photo'), async(req, res, next) => {
    // fs.access('./uploads', err=>{
    //     if(err){
    //         fs.mkdirSync('./uploads')
    //     }
    // })
    
//    await sharp(req.file.buffer).resize({ width: 200,
//     height: 200,
//     fit: sharp.fit.cover,
//     position: sharp.strategy.entropy}).withMetadata().toFile('./uploads/'+ req.file.originalname);
 
        if (!req.file) {
         console.log("no file")
        }
        // console.log(req.file.filename ) 
       try{
        const response = await drive.files.create({
            requestBody : {
                name : req.file.filename ,
                mimeType : req.file.mimetype
            },
            media : {
                mimeType :  req.file.mimetype,
                body : fs.createReadStream(req.file.path)
            }
        })
        console.log(response.data)

        const t = await drive.permissions.create({
            fileId : response.data.id,
            requestBody : {
                role : 'reader',
                type : 'anyone'
    
            }
        })
        // const result = await drive.files.get({
        //     fileId : '1XZVXWBLIC12nircI4hsZOwM0I_fMqesG',
        //     fields : 'webViewLink, webContentLink'
        // })
    console.log(t.data)
       }
       catch (e) {
           console.log(e)
       }
            finally{
                const newProduct = new Product({
 
                    Name : req.body.Name,
                    Status : "New",
            
                   Price : req.body.Price,
                   Cost : req.body.Cost,
                   Size: req.body.Size,
                   Condition : req.body.Condition,
                   Condition_desc : req.body.Condition_desc,
                   Chest : req.body.Chest,
                   Length : req.body.Length,
                   Shoulder : req.body.Shoulder==null?0:req.body.Shoulder,
                  photo :req.file.originalname
               });
            console.log(newProduct)
               const r = newProduct.save()
               res.send(r)
            }
   
           
});


async function uploadFile(fileName){
    const filepath = './uploads/'+fileName
  try {
      const response = await drive.files.create({
          requestBody : {
              name : fileName,
              mimeType : 'image/jpg'
          },
          media : {
              mimeType : 'image/jpg',
              body : fs.createReadStream(filepath)
          }
      })
      console.log(response.data)
      
  } catch (error) {
      console.log(error.message)
  }
}


module.exports = router;

// 950238006168-t62eokspnj5ofj4eigesb70rh69u9m5j.apps.googleusercontent.com
// gDrYIPXoB6SR79LrZWHWMZ1G


