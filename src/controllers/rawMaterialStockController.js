const RawMaterial = require("../models/rawMaterialSchema");

const rawMaterialStock = async (req, res) => {
  try {
    const { name, status } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !image) {
      return res.status(400).json({ success: false, message: "Name and image are required." });
    }

    const newRawMaterial = new RawMaterial({
      name,
      image,
      status: status || "active",
    });

    await newRawMaterial.save();

    res.status(200).json({ success: true, data: newRawMaterial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const allRawMaterialStock = async(req, res) => {
 try{
   
  const allRawMaterialFetch = await RawMaterial.find();
  res.status(200).json({success: true, data : allRawMaterialFetch});

 }catch(error){
   res.status(500).json({success: false, message: error.message});
 }
}


const updateRawMaterial = async (req, res) => {
  try {
    const { name, status } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (status) updatedFields.status = status;
    if (image) updatedFields.image = image;

    const rawMaterialUpdate = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!rawMaterialUpdate) {
      return res.status(404).json({ success: false, message: "Raw material not found" });
    }

    res.status(200).json({ success: true, data: rawMaterialUpdate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteRawmaterial = async(req, res) => {
  try{ 
    const deleteRawMaterialFromStock = await RawMaterial.findByIdAndDelete(req.params.id);

    if(!deleteRawMaterialFromStock){
       return res.status(400).json({successs: false, message: "Raw Material in not found in the stock"})
    }
   
    res.status(200).json({success: true, message:"Raw Material is deleted successfully"});
  }catch(error){
    res.status(500).json({success: false, message: error.message});
  }
}

module.exports = { rawMaterialStock, allRawMaterialStock, updateRawMaterial, deleteRawmaterial }; 
