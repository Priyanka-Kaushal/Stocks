const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  image: {
    type: String,
    required: true, 
  },
  status: {
    type: String,
    enum: ["active", "inactive"], 
    default: "active",           
  },
},
  { timestamps: true } 
);

const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);
module.exports = RawMaterial;
