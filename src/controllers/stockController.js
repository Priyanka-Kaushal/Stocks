const express = require("express");
const mongoose = require("mongoose");
const Stock = require("../models/stockSchema");


const createStock = async (req, res) => {
  try {
    const { name, quantity, unit, category, price, stock } = req.body;
    console.log("Request Body:", req.body);

    const newStock = new Stock({ 
        name, quantity, unit, category, price, stock 
    });
    await newStock.save();

    res.status(201).json({ success: true, data: newStock });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllStock = async(req, res) => {
    try{
const stocks = await Stock.find();
 res.status(200).json({ success: true, data: stocks });
    }catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const individualStock = async(req, res) => {
  try{
    const getStock = await Stock.findById(req.params.id);

    if(!getStock){
      return res.status(400).json({success: false, message: "Stock Not found"})
    }
    res.status(200).json({
  success: true,
  message: "Stock retrieved successfully.",
  data: getStock
});
  }catch(error){
    res.status(500).json({success: false, message: error.message})
  }
}

const updateStock =  async(req, res) => {
 try{
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedStock) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }

    res.status(200).json({ success: true, data: updatedStock });
 }catch(error){
 res.status(500).json({success: false, message: error.message});

 }
}


const deleteStock = async(req, res) => {
    try{
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);

    if (!deletedStock) {
      return res.status(404).json({ success: false, message: "Stock not found" });
    }

    res.status(200).json({ success: true, message: "Stock deleted successfully" });
    }catch(error){
        res.status().json({success: false, message: error.message});
    }
}
module.exports = {createStock, getAllStock, individualStock, updateStock, deleteStock};