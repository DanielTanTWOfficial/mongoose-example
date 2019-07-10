var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    store_id: String
 });
 
 module.exports = mongoose.model("Product", productSchema);