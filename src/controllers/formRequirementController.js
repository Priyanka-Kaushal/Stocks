import pool from '../utils/db.js';

export const createRequirementForm = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      rawMaterialType,
      rawMaterialTypeName,
      vehicleType,
      vehicleTypeName,
      stockId,
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

    await client.query('BEGIN');

    let rawMaterialId = rawMaterialType;
    let vehicleId = vehicleType;
    let stockObjectId = stockId;

    if (!rawMaterialId && rawMaterialTypeName) {
      const rmCheck = await client.query(
        `SELECT id FROM raw_materials WHERE name = $1`,
        [rawMaterialTypeName]
      );
      if (rmCheck.rowCount > 0) {
        rawMaterialId = rmCheck.rows[0].id;
      } else {
        const rmInsert = await client.query(
          `INSERT INTO raw_materials (name, image) VALUES ($1, $2) RETURNING id`,
          [rawMaterialTypeName, req.files?.rawMaterialTypeImage?.[0]?.path || null]
        );
        rawMaterialId = rmInsert.rows[0].id;
      }
    }


    if (!vehicleId && vehicleTypeName) {
      const vehicleCheck = await client.query(
        `SELECT id FROM vehicles WHERE name = $1`,
        [vehicleTypeName]
      );
      if (vehicleCheck.rowCount > 0) {
        vehicleId = vehicleCheck.rows[0].id;
      } else {
        const vehicleInsert = await client.query(
          `INSERT INTO vehicles (name, image) VALUES ($1, $2) RETURNING id`,
          [vehicleTypeName, req.files?.vehicleTypeImage?.[0]?.path || null]
        );
        vehicleId = vehicleInsert.rows[0].id;
      }
    }

    if (!stockObjectId) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Stock ID is required. Please select an existing stock.",
      });
    }

    if (!rawMaterialId || !vehicleId || !stockObjectId) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Raw Material ID, Vehicle ID, and Stock ID are required.",
      });
    }


    const insertQuery = `
      INSERT INTO inventory.requirement_forms (
        raw_material_type_id,
        quantity_value,
        quantity_photo,
        vehicle_type_id,
        vehicle_reg_number,
        vehicle_reg_photo,
        stock_id,
        supplier_name,
        supplier_contact_number,
        price_per_ton,
        moisture_content_value,
        moisture_content_image,
        ash_content_value,
        ash_content_image,
        gcv_value,
        gcv_image,
        supervisor_name,
        created_at,
        type
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP, 'requirement'
      )
      RETURNING *;
    `;

    const values = [
      rawMaterialId,
      Number(quantityValue),
      req.files["quantityPhoto"]?.[0]?.path || null,
      vehicleId,
      vehicleRegNumber,
      req.files["vehicleRegPhoto"]?.[0]?.path || null,
      stockObjectId,
      supplierName,
      contactNumber,
      Number(pricePerTon),
      Number(moistureContentValue),
      req.files["moistureImage"]?.[0]?.path || null,
      Number(ashContentValue),
      req.files["ashContentImage"]?.[0]?.path || null,
      Number(gcvValue),
      req.files["gcvImage"]?.[0]?.path || null,
      supervisorName,
    ];

    const result = await client.query(insertQuery, values);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: "Requirement form created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error creating requirement form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create requirement form",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export const getAllRequirements = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        rf.*,
        row_to_json(rm) AS raw_material,
        row_to_json(v) AS vehicle,
        row_to_json(s) AS stock
      FROM inventory.requirement_forms rf
      JOIN inventory.raw_materials rm ON rf.raw_material_type_id = rm.id
      JOIN inventory.vehicles v ON rf.vehicle_type_id = v.id
      JOIN inventory.stock s ON rf.stock_id = s.id
      ORDER BY rf.created_at DESC
    `);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

