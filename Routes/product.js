const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const router = express.Router();
const Product = require('../Models/product')
var cors = require('cors')


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



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
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
router.route('/add').post(upload.single('photo'), (req, res, next) => {
 
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
       Shoulder : req.body.Shoulder,
      photo : file.filename
   });
console.log(newProduct)
   newProduct.save()
           .then(() => res.json('User Added'))
           .catch(err => {res.status(400).json('Error: ' + err); 
        console.log(err)});
});


module.exports = router;

