const Vehicle = require("../models/vehicleSchema");

const createVehicle = async (req, res) => {
  try {
    const { name, status } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !image) {
      return res.status(400).json({ success: false, message: "Name and image are required." });
    }

    const newVehicle = new Vehicle({
      name,
      image,
      status: status || "active",
    });

    await newVehicle.save();

    res.status(201).json({ success: true, data: newVehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const retrieveVehicle = async(req, res) => {
  try{
    const getVehicle = await Vehicle.findById(req.params.id);

    if(!getVehicle){
      return res.status(400).json({success: false, message: "Vehicle Not found"})
    }
    res.status(200).json({
  success: true,
  message: "Vehicle retrieved successfully.",
  data: getVehicle
});
  }catch(error){
    res.status(500).json({success: false, message: error.message})
  }
}

const updateVehicle = async (req, res) => {
  try {
    const { name, status } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedData = { name, status };
    if (image) updatedData.image = image;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedVehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }

    res.status(200).json({ success: true, data: updatedVehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteVehicleInfo = async(req, res) => {
    try{
    const deleteVehicle =  await Vehicle.findByIdAndDelete(req.params.id);

    if(!deleteVehicle){
        return res.status(404).json({success: false, message: "Vehicle information not found"});

    }

    res.status(200).json({
        success: true, message: "Vehicle Information deleted successfully"
    })
    
    }catch(error){
     res.status(500).json({success: false, message: error.message});

    }
}


module.exports = {
  createVehicle,
  getAllVehicles,
  retrieveVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicleInfo,
};