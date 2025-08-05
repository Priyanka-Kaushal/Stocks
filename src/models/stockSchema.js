const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ["kg", "g", "mg", "lb", "oz"], 
  },
  category: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: { 
    type: Number,
    default: 0,
  },
});

const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
