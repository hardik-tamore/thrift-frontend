const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require("body-parser");
var cors = require('cors')
app.use(cors())


// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, 'uploads')
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, `${file.originalname}`)
//     }
//   })
// let upload = multer({ dest: 'uploads/' })
// const server = express();
// server.post('/uploadFileAPI',cors(), upload.single('file'), (req, res, next) => {
//     const file = req.file;
//     console.log(file.filename);
//     if (!file) {
//       const error = new Error('No File')
//       error.httpStatusCode = 400
//       return next(error)
//     }
//     const csvFilePath='uploads/' +file.filename
// const csv=require('csvtojson')
// csv()
// .fromFile(csvFilePath)
// .then((jsonObj)=>{
//     res.send(jsonObj);
// })
      
//   })




 



require('dotenv/config');

mongoose.connect(
    process.env.DB_CONNECTION,
    { useUnifiedTopology: true,  useNewUrlParser: true  },
()=>{
    console.log('connected')
}
) 

//MIDDLEWARE
app.use(express.json());   
app.use(bodyParser.json({ type: 'application/json' }));
app.use('/posts',()=>{
    console.log('This is a middle ware')
})

//ROUTES
const productroute = require('./Routes/product');

app.use('/product', productroute);

app.get('/',(req, res)=>{
    res.send('Home')
});

app.use(express.static('public'));  
app.use('/uploads', express.static('uploads')); 

const port = process.env.PORT || 3000;
app.listen(port , ()=>console.log(`Server Started on port ${port}`));



