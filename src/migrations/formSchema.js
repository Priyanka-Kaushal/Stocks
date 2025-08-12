// const mongoose = require("mongoose");

// const requirementFormSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["requirement"],
//     default: "requirement",
//     required: true
//   },

  
// rawMaterialType: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "RawMaterial",
//   required: true
// }, 
//   quantity: {
//     value: { type: Number, required: true },
//     photo: { type: String, required: true }
//   },

//   // vehicleType: {
//   //   name: { type: String, required: true },
//   //   image: { type: String, required: true }
//   // },
//   vehicleType: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Vehicle",
//     required: true,
//   },

//   vehicleRegNumber: { type: String, required: true },
//   vehicleRegPhoto: { type: String, required: true },

//    stockId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Stock",
//     required: true,
//   },
  
//   supplier: {
//     name: { type: String, required: true },
//     contactNumber: { type: String, required: true }
//   },

//   pricePerTon: { type: Number, required: true },

//   moistureContent: {
//     value: { type: Number, required: true },
//     image: { type: String, required: true }
//   },

//   ashContent: {
//     value: { type: Number, required: true },
//     image: { type: String, required: true }
//   },

//   gcv: {
//     value: { type: Number, required: true },
//     image: { type: String, required: true }
//   },

//   supervisorName: { type: String, required: true },

//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("RequirementForm", requirementFormSchema);


