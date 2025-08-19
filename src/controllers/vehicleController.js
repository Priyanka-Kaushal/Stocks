// const Vehicle = require("../models/vehicleSchema");

// const createVehicle = async (req, res) => {
//   try {
//     const { name, status } = req.body;
//     const image = req.file ? req.file.path : null;

//     if (!name || !image) {
//       return res.status(400).json({ success: false, message: "Name and image are required." });
//     }

//     const newVehicle = new Vehicle({
//       name,
//       image,
//       status: status || "active",
//     });

//     await newVehicle.save();

//     res.status(201).json({ success: true, data: newVehicle });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// const getAllVehicles = async (req, res) => {
//   try {
//     const vehicles = await Vehicle.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: vehicles });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// const getVehicleById = async (req, res) => {
//   try {
//     const vehicle = await Vehicle.findById(req.params.id);
//     if (!vehicle) {
//       return res.status(404).json({ success: false, message: "Vehicle not found." });
//     }
//     res.status(200).json({ success: true, data: vehicle });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const retrieveVehicle = async(req, res) => {
//   try{
//     const getVehicle = await Vehicle.findById(req.params.id);

//     if(!getVehicle){
//       return res.status(400).json({success: false, message: "Vehicle Not found"})
//     }
//     res.status(200).json({
//   success: true,
//   message: "Vehicle retrieved successfully.",
//   data: getVehicle
// });
//   }catch(error){
//     res.status(500).json({success: false, message: error.message})
//   }
// }

// const updateVehicle = async (req, res) => {
//   try {
//     const { name, status } = req.body;
//     const image = req.file ? req.file.path : undefined;

//     const updatedData = { name, status };
//     if (image) updatedData.image = image;

//     const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedVehicle) {
//       return res.status(404).json({ success: false, message: "Vehicle not found." });
//     }

//     res.status(200).json({ success: true, data: updatedVehicle });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// const deleteVehicleInfo = async(req, res) => {
//     try{
//     const deleteVehicle =  await Vehicle.findByIdAndDelete(req.params.id);

//     if(!deleteVehicle){
//         return res.status(404).json({success: false, message: "Vehicle information not found"});

//     }

//     res.status(200).json({
//         success: true, message: "Vehicle Information deleted successfully"
//     })
    
//     }catch(error){
//      res.status(500).json({success: false, message: error.message});

//     }
// }


// module.exports = {
//   createVehicle,
//   getAllVehicles,
//   retrieveVehicle,
//   getVehicleById,
//   updateVehicle,
//   deleteVehicleInfo,
// };



// import pool from '../utils/db.js'; 

// const SCHEMA_TABLE = "inventory.vehicles";

// export const createVehicle = async (req, res) => {
//     console.log("req.body:", req.body);
//   console.log("req.file:", req.file);
//   try {
//     const { name, status } = req.body;
//     const image = req.file ? req.file.path : null;

//     if (!name || !image) {
//       return res.status(400).json({ success: false, message: "Name and image are required." });
//     }

//     const insertQuery = `
//       INSERT INTO inventory.vehicles (name, image, status)
//       VALUES ($1, $2, $3)
//       RETURNING *;
//     `;

//     const values = [name, image, status || 'active'];

//     const result = await pool.query(insertQuery, values);

//     res.status(201).json({ success: true, data: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// export const getAllVehicles = async (req, res) => {
//   try {
//     const selectQuery = `SELECT * FROM inventory.vehicles ORDER BY created_at DESC`;
//     const result = await pool.query(selectQuery);
//     res.status(200).json({ success: true, data: result.rows });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// export const getVehicleById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const selectQuery = `SELECT * FROM inventory.vehicles WHERE id = $1`;
//     const result = await pool.query(selectQuery, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, message: "Vehicle not found." });
//     }

//     res.status(200).json({ success: true, data: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const updateVehicle = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, status } = req.body;
//     const image = req.file ? req.file.path : undefined;

//     const fields = [];
//     const values = [];
//     let idx = 1;

//     if (name) {
//       fields.push(`name = $${idx++}`);
//       values.push(name);
//     }
//     if (status) {
//       fields.push(`status = $${idx++}`);
//       values.push(status);
//     }
//     if (image) {
//       fields.push(`image = $${idx++}`);
//       values.push(image);
//     }
//     fields.push(`updated_at = NOW()`);

//     if (fields.length === 1) { 
//       return res.status(400).json({ success: false, message: "No fields to update" });
//     }

//     const updateQuery = `
//       UPDATE inventory.vehicles SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;
//     `;

//     values.push(id);

//     const result = await pool.query(updateQuery, values);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, message: "Vehicle not found." });
//     }

//     res.status(200).json({ success: true, data: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// export const deleteVehicleInfo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteQuery = `DELETE FROM inventory.vehicles WHERE id = $1 RETURNING *;`;
//     const result = await pool.query(deleteQuery, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, message: "Vehicle information not found." });
//     }

//     res.status(200).json({ success: true, message: "Vehicle information deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


import pool from '../utils/db.js'; 

const SCHEMA_TABLE = "inventory.vehicles";

export const createVehicle = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    const { name, status } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !image) {
      return res.status(400).json({ success: false, message: "Name and image are required." });
    }

    const insertQuery = `
      INSERT INTO ${SCHEMA_TABLE} (name, image, status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [name, image, status || 'active'];

    const result = await pool.query(insertQuery, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllVehicles = async (req, res) => {
  try {
    const selectQuery = `SELECT * FROM ${SCHEMA_TABLE} ORDER BY created_at DESC`;
    const result = await pool.query(selectQuery);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const selectQuery = `SELECT * FROM ${SCHEMA_TABLE} WHERE id = $1`;
    const result = await pool.query(selectQuery, [id]);

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const image = req.file ? req.file.path : undefined;

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) { fields.push(`name = $${idx++}`); values.push(name); }
    if (status) { fields.push(`status = $${idx++}`); values.push(status); }
    if (image) { fields.push(`image = $${idx++}`); values.push(image); }
    fields.push(`updated_at = NOW()`);

    if (fields.length === 1) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const updateQuery = `
      UPDATE ${SCHEMA_TABLE} 
      SET ${fields.join(', ')} 
      WHERE id = $${idx} 
      RETURNING *;
    `;
    values.push(id);

    const result = await pool.query(updateQuery, values);
    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteVehicleInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM ${SCHEMA_TABLE} WHERE id = $1 RETURNING *;`;
    const result = await pool.query(deleteQuery, [id]);

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Vehicle information not found." });
    }

    res.status(200).json({ success: true, message: "Vehicle information deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
