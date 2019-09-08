const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = express.Router();
const PORT = 4000;

let Product = require('./model/product');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/product', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

productRoutes.route('/').get(function(req, res) {
    Product.find(function(err, products) {
        if (err) {
            console.log(err);
        } else {
            res.json(products);
        }
    });
});


// INDEX
app.get('/api/products', (req, res) => {
    Product.find({}, (err, allProducts) => {
    if (err) { console.log(err) }
    res.json(allProducts);
  });
});
// SHOW
app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
    if (err) { console.log(err) }
    res.json(foundProduct);
  });
});

// //CREATE
// app.post('/api/products', (req, res)=>{
 
//   Product.create(req.body, (error, createdProduct)=>{
//       res.json(createdProduct);
//   });
// });

// UPDATE
// app.put('/api/products/:id', (req, res) => {

//   Product.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedModel) => {
//     res.json(updatedModel);
//   });
// });


// DELETE

app.delete('/products/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) { console.log(err) }
    res.json(data);
  });
});

// productRoutes.route('/:id').get(function(req, res) {
//     let id = req.params.id;
//     Product.findById(id, function(err, product) {
//         res.json(product);
//     });
// });

//CREATE
productRoutes.route('/add').post(function(req, res) {
    let product = new Product(req.body);
    product.save()
        .then(product => {
            res.status(200).json({'product': ' added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new failed');
        });
});

productRoutes.route('/update/:id').post(function(req, res) {
    Product.findById(req.params.id, function(err, product) {
        if (!product)
            res.status(404).send('data is not found');
        else
            product.name = req.body.name;
            product.image= req.body.image; 
            product.color = req.body.color;
            product.price = req.body.price;
            product.description = req.body.description;

            product.save().then(product => {
                res.json(' updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.use('/products',productRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

app.get('/product/seed', (req, res) => {
    Product.insertMany([
        {
            
            "name": "T-shirt ",
            "color": "Purple",
            "image": "http://picture-cdn.wheretoget.it/cs8b6e-l-610x610-t+shirt-sleeve-t+shirt-shirt-disney-punk-gothic-violet-purple-cute-star-disney+princess-princess-pastel.jpg",
            "price": "40",
            "description": "purple disney t-shirt",
           
        },
        {
           
            "name": "T-shirt33",
            "color": "white",
            "image": "https://www.dhresource.com/0x0s/f2-albu-g6-M00-1F-6F-rBVaSFuSD_qAXMBKAADDaflDc8E364.jpg/musical-note-design-mens-t-shirt-music-musician.jpg",
            "price": "40",
            "description": "White T-shirt ",
           
        },
        {
           
            "name": "T-shirt ",
            "color": "yellow ",
            "image": "data:image/jpeg;base64,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",
            "price": "20",
            "description": "yellow t-shirt ",
        
        },
        {
            
            "name": "T-shirt ",
            "color": "brown",
            "image": "data:image/jpeg;base64,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",
            "price": "20",
            "description": "brown ",
           
        },
        {
            
            "name": "T-shirt ",
            "color": "blue ",
            "image": "https://ae01.alicdn.com/kf/HTB14cUdSpXXXXbhXFXXq6xXFXXXn/I-Hate-Programming-Computer-Programmer-Coding-2017-T-Shirt-Design-Company-Summer-Fun-T-Shirt-Cotton.jpg",
            "price": "40 ",
            "description": "blue ",
           
        }
  ], (err, Products) => {
    res.json(Products);
  })
});
