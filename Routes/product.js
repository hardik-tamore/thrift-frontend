const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const router = express.Router();
const Product = require('../Models/product')
var cors = require('cors')
const sharp = require('sharp')
const fs = require('fs')


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

router.patch("/:id", async (req, res) => {
	try {
		const product = await Product.findOne({ _id: req.params.id })

		if (req.body.Status) {
			product.Status = req.body.Status
		}

	

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



const storage = multer.memoryStorage({
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

// const fileFilter = (req, file, cb) => {
//     const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//     if(allowedFileTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }
// let upload = multer({ storage, fileFilter });
// const storage = multer.memoryStorage();
let upload = multer({storage})


router.post('/add',upload.single('photo'), async(req, res) => {
    fs.access('./uploads', err=>{
        if(err){
            fs.mkdirSync('./uploads')
        }
    })
    
   await sharp(req.file.buffer).resize({ width: 200,
    height: 200,
    fit: sharp.fit.cover,
    position: sharp.strategy.entropy}).withMetadata().toFile('./uploads/'+ req.file.originalname);
    const file = req.file;
      
        if (!file) {
         console.log("no file")
        }
        console.log(req.file.filename )
      
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
           
});


module.exports = router;

