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

productRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Product.findById(id, function(err, product) {
        res.json(product);
    });
});

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
