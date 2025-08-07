
const RequirementForm = require("../models/formSchema");
const RawMaterial = require("../models/rawMaterialSchema");
const Vehicle = require("../models/vehicleSchema");
const Stock = require("../models/stockSchema");


const createRequirementForm = async (req, res) => {
  try {
    const {
      rawMaterialType,
      rawMaterialTypeName,
      vehicleType,
      vehicleTypeName,
      stockId,
      stockName,
      vehicleRegNumber,
      quantityValue,
      supplierName,
      contactNumber,
      pricePerTon,
      moistureContentValue,
      ashContentValue,
      gcvValue,
      supervisorName,
    } = req.body;

    let rawMaterialId = rawMaterialType;
    let vehicleId = vehicleType;
    let stockObjectId = stockId;

    if (!rawMaterialId && rawMaterialTypeName) {
      const rawMaterialImage = req.files?.rawMaterialTypeImage?.[0]?.path || "";
      const existing = await RawMaterial.findOne({ name: rawMaterialTypeName });
      if (existing) {
        rawMaterialId = existing._id;
      } else {
        const newRM = await RawMaterial.create({
          name: rawMaterialTypeName,
          image: rawMaterialImage,
        });
        rawMaterialId = newRM._id;
      }
    }

    if (!vehicleId && vehicleTypeName) {
      const vehicleImage = req.files?.vehicleTypeImage?.[0]?.path || "";
      const existingVehicle = await Vehicle.findOne({ name: vehicleTypeName });
      if (existingVehicle) {
        vehicleId = existingVehicle._id;
      } else {
        const newVehicle = await Vehicle.create({
          name: vehicleTypeName,
          image: vehicleImage,
        });
        vehicleId = newVehicle._id;
      }
    }

    if (!stockObjectId) {
  return res.status(400).json({
    success: false,
    message: "Stock ID is required. Please select an existing stock.",
  });
}

  
    if (!rawMaterialId || !vehicleId || !stockObjectId) {
      return res.status(400).json({
        success: false,
        message: "Raw Material ID, Vehicle ID, and Stock ID are required.",
      });
    }


    const newForm = new RequirementForm({
      rawMaterialType: rawMaterialId,
      quantity: {
        value: Number(quantityValue),
        photo: req.files["quantityPhoto"]?.[0]?.path,
      },
      vehicleType: vehicleId,
      vehicleRegNumber,
      vehicleRegPhoto: req.files["vehicleRegPhoto"]?.[0]?.path,
      stockId: stockObjectId,
      supplier: {
        name: supplierName,
        contactNumber,
      },
      pricePerTon: Number(pricePerTon),
      moistureContent: {
        value: Number(moistureContentValue),
        image: req.files["moistureImage"]?.[0]?.path,
      },
      ashContent: {
        value: Number(ashContentValue),
        image: req.files["ashContentImage"]?.[0]?.path,
      },
      gcv: {
        value: Number(gcvValue),
        image: req.files["gcvImage"]?.[0]?.path,
      },
      supervisorName,
    });

    await newForm.save();

    res.status(201).json({
      success: true,
      message: "Requirement form created successfully",
      data: newForm,
    });

  } catch (error) {
    console.error("Error creating requirement form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create requirement form",
      error: error.message,
    });
  }
};

const getAllRequirements = async (req, res) => {
  try {
    const forms = await RequirementForm.find()
      .populate("rawMaterialType")
      .populate("vehicleType")
      .populate("stockId");

    res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch requirement forms",
    });
  }
};

module.exports = {
  createRequirementForm,
  getAllRequirements,
};
